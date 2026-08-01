import { ExportPoint } from './gpx.builder';

/**
 * Minimal FIT "course" file encoder.
 *
 * The FIT binary protocol (Garmin/ANT+) is large; this implements only what a
 * course file needs to be readable by Garmin Connect / Wahoo / most bike
 * computers: file_id, course, lap and record messages carrying
 * position/altitude/distance/timestamp. Course points (turn-by-turn cues),
 * developer fields and compressed timestamps are NOT implemented — this is a
 * deliberate, documented scope reduction (see README "Limites connues"),
 * not a bug.
 *
 * Field layout follows the public FIT SDK Global Profile message
 * definitions (file_id=0, course=31, lap=19, record=20).
 */

const FIT_EPOCH_OFFSET_S = 631065600; // seconds between Unix epoch and FIT epoch (1989-12-31T00:00:00Z)
const SEMICIRCLE = 2 ** 31 / 180;

function degToSemicircles(deg: number): number {
  return Math.round(deg * SEMICIRCLE);
}

function toFitTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000) - FIT_EPOCH_OFFSET_S;
}

// Standard FIT CRC-16 algorithm (public Garmin FIT SDK specification).
const CRC_TABLE = [
  0x0000, 0xcc01, 0xd801, 0x1400, 0xf001, 0x3c00, 0x2800, 0xe401, 0xa001, 0x6c00, 0x7800, 0xb401,
  0x5000, 0x9c01, 0x8801, 0x4400,
];

function crc16(buf: Buffer): number {
  let crc = 0;
  for (const byte of buf) {
    let tmp = CRC_TABLE[crc & 0xf];
    crc = (crc >> 4) & 0x0fff;
    crc = crc ^ tmp ^ CRC_TABLE[byte & 0xf];
    tmp = CRC_TABLE[crc & 0xf];
    crc = (crc >> 4) & 0x0fff;
    crc = crc ^ tmp ^ CRC_TABLE[(byte >> 4) & 0xf];
  }
  return crc;
}

interface FieldDef {
  num: number;
  size: number;
  baseType: number;
}

const BASE_TYPE = {
  enum: 0x00,
  uint8: 0x02,
  string: 0x07,
  uint16: 0x84,
  sint32: 0x85,
  uint32: 0x86,
};

function definitionMessage(localType: number, globalMesgNum: number, fields: FieldDef[]): Buffer {
  const header = Buffer.from([0x40 | localType]);
  const fixed = Buffer.from([0, 0, globalMesgNum & 0xff, (globalMesgNum >> 8) & 0xff, fields.length]);
  const fieldDefs = Buffer.concat(fields.map((f) => Buffer.from([f.num, f.size, f.baseType])));
  return Buffer.concat([header, fixed, fieldDefs]);
}

function dataMessageHeader(localType: number): Buffer {
  return Buffer.from([localType & 0x0f]);
}

export function buildFit(name: string, points: ExportPoint[], distanceM: number): Buffer {
  const now = toFitTimestamp(new Date());
  const chunks: Buffer[] = [];

  // --- file_id (local type 0) ---
  chunks.push(
    definitionMessage(0, 0, [
      { num: 0, size: 1, baseType: BASE_TYPE.enum }, // type = course(6)
      { num: 4, size: 4, baseType: BASE_TYPE.uint32 }, // time_created
    ]),
  );
  const fileId = Buffer.alloc(5);
  fileId.writeUInt8(6, 0); // type: course
  fileId.writeUInt32LE(now, 1);
  chunks.push(Buffer.concat([dataMessageHeader(0), fileId]));

  // --- course (local type 1) ---
  const nameBuf = Buffer.alloc(32, 0);
  nameBuf.write(name.slice(0, 31), 0, 'utf8');
  chunks.push(
    definitionMessage(1, 31, [
      { num: 4, size: 1, baseType: BASE_TYPE.enum }, // sport
      { num: 5, size: 32, baseType: BASE_TYPE.string }, // name
    ]),
  );
  const courseMsg = Buffer.concat([Buffer.from([2 /* cycling */]), nameBuf]);
  chunks.push(Buffer.concat([dataMessageHeader(1), courseMsg]));

  // --- lap (local type 2) ---
  chunks.push(
    definitionMessage(2, 19, [
      { num: 253, size: 4, baseType: BASE_TYPE.uint32 }, // timestamp
      { num: 2, size: 4, baseType: BASE_TYPE.uint32 }, // start_time
      { num: 7, size: 4, baseType: BASE_TYPE.uint32 }, // total_elapsed_time
      { num: 9, size: 4, baseType: BASE_TYPE.uint32 }, // total_distance
    ]),
  );
  const lapMsg = Buffer.alloc(16);
  lapMsg.writeUInt32LE(now, 0);
  lapMsg.writeUInt32LE(now, 4);
  lapMsg.writeUInt32LE(0, 8);
  lapMsg.writeUInt32LE(Math.round(distanceM * 100), 12);
  chunks.push(Buffer.concat([dataMessageHeader(2), lapMsg]));

  // --- record (local type 3), one per point ---
  chunks.push(
    definitionMessage(3, 20, [
      { num: 253, size: 4, baseType: BASE_TYPE.uint32 }, // timestamp
      { num: 0, size: 4, baseType: BASE_TYPE.sint32 }, // position_lat
      { num: 1, size: 4, baseType: BASE_TYPE.sint32 }, // position_long
      { num: 2, size: 2, baseType: BASE_TYPE.uint16 }, // altitude
      { num: 5, size: 4, baseType: BASE_TYPE.uint32 }, // distance
    ]),
  );

  let cumulativeM = 0;
  for (let i = 0; i < points.length; i++) {
    if (i > 0) {
      const dx = points[i].lon - points[i - 1].lon;
      const dy = points[i].lat - points[i - 1].lat;
      cumulativeM += Math.sqrt(dx * dx + dy * dy) * 111_320; // rough metric spacing, fine for course playback
    }
    const rec = Buffer.alloc(18);
    rec.writeUInt32LE(now + i, 0);
    rec.writeInt32LE(degToSemicircles(points[i].lat), 4);
    rec.writeInt32LE(degToSemicircles(points[i].lon), 8);
    rec.writeUInt16LE(Math.round(((points[i].ele ?? 0) + 500) * 5), 12);
    rec.writeUInt32LE(Math.round(cumulativeM * 100), 14);
    chunks.push(Buffer.concat([dataMessageHeader(3), rec]));
  }

  const dataBuf = Buffer.concat(chunks);

  const header = Buffer.alloc(12);
  header.writeUInt8(12, 0); // header size
  header.writeUInt8(0x10, 1); // protocol version 1.0
  header.writeUInt16LE(2078, 2); // profile version (arbitrary recent value)
  header.writeUInt32LE(dataBuf.length, 4);
  header.write('.FIT', 8, 'ascii');

  const withoutCrc = Buffer.concat([header, dataBuf]);
  const crc = crc16(withoutCrc);
  const crcBuf = Buffer.alloc(2);
  crcBuf.writeUInt16LE(crc, 0);

  return Buffer.concat([withoutCrc, crcBuf]);
}
