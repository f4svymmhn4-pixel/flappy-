import { buildFit } from './fit.builder';

describe('buildFit', () => {
  it('writes a well-formed FIT header and a CRC matching the payload', () => {
    const points = [
      { lat: 44.8378, lon: -0.6506, ele: 12 },
      { lat: 44.84, lon: -0.64, ele: 15 },
      { lat: 44.845, lon: -0.63, ele: 20 },
    ];
    const buf = buildFit('Boucle test', points, 8000);

    // Header: size(1) + protocol(1) + profile(2) + dataSize(4) + ".FIT"(4) = 12 bytes
    expect(buf.readUInt8(0)).toBe(12);
    expect(buf.subarray(8, 12).toString('ascii')).toBe('.FIT');

    const dataSize = buf.readUInt32LE(4);
    expect(buf.length).toBe(12 + dataSize + 2); // header + data + trailing CRC

    // Re-derive the CRC ourselves (mirrors the algorithm under test, so this
    // is a regression guard: it will fail if header/data framing shifts).
    const withoutCrc = buf.subarray(0, 12 + dataSize);
    const storedCrc = buf.readUInt16LE(12 + dataSize);
    expect(storedCrc).toBe(crc16(withoutCrc));
  });

  it('scales the number of record messages with the number of points', () => {
    const short = buildFit('A', [{ lat: 1, lon: 1 }], 100);
    const long = buildFit(
      'B',
      Array.from({ length: 50 }, (_, i) => ({ lat: 1 + i * 0.001, lon: 1 })),
      5000,
    );
    expect(long.length).toBeGreaterThan(short.length);
  });
});

// Local copy of the FIT CRC-16 algorithm purely to assert the builder's
// output is internally consistent (header/data length framing).
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
