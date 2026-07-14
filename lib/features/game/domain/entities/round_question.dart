import 'package:equatable/equatable.dart';

/// The payload `get_round_question` returns: everything needed to render
/// a round's question and answer tiles. [correctOption] is only ever
/// non-null once the round has moved past `active` — the RPC itself
/// enforces that server-side, this is just the client-side mirror of that
/// contract.
class RoundQuestion extends Equatable {
  const RoundQuestion({
    required this.roundId,
    required this.roundNumber,
    required this.categoryId,
    required this.prompt,
    required this.options,
    required this.correctOption,
  });

  factory RoundQuestion.fromJson(Map<String, dynamic> json) {
    return RoundQuestion(
      roundId: json['round_id'] as String,
      roundNumber: json['round_number'] as int,
      categoryId: json['category_id'] as String,
      prompt: json['prompt'] as String,
      options: [
        json['option_a'] as String,
        json['option_b'] as String,
        json['option_c'] as String,
        json['option_d'] as String,
      ],
      correctOption: json['correct_option'] as int?,
    );
  }

  final String roundId;
  final int roundNumber;
  final String categoryId;
  final String prompt;

  /// Always exactly 4 entries, in on-screen order (top-left, top-right,
  /// bottom-left, bottom-right).
  final List<String> options;
  final int? correctOption;

  bool get isRevealed => correctOption != null;

  @override
  List<Object?> get props => [roundId, roundNumber, categoryId, prompt, options, correctOption];
}
