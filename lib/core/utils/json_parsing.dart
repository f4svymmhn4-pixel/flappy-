/// Shared by every `fromJson` model that has a nullable `timestamptz`
/// column, so the null-check + `DateTime.parse` pair isn't repeated in
/// each model file.
DateTime? parseNullableTimestamp(Object? value) {
  return value == null ? null : DateTime.parse(value as String);
}
