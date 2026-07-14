import 'package:betiz/features/game/domain/entities/game_player.dart';
import 'package:betiz/features/game/domain/entities/game_status.dart';
import 'package:betiz/features/game/presentation/widgets/ranking_list.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

GamePlayer _player(String id, {required int score}) => GamePlayer(
      id: id,
      gameId: 'game-1',
      userId: 'user-$id',
      isBot: false,
      botDifficulty: null,
      animalId: 'animal-1',
      status: GamePlayerStatus.joined,
      score: score,
      correctAnswers: 0,
    );

void main() {
  testWidgets('sorts players by score descending and animates in without error', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: RankingList(
            players: [_player('a', score: 3), _player('b', score: 9), _player('c', score: 6)],
          ),
        ),
      ),
    );

    await tester.pump();
    await tester.pump(const Duration(milliseconds: 500));

    final List<String> pointsInOrder = tester
        .widgetList<Text>(find.textContaining('pts'))
        .map((widget) => widget.data!)
        .toList();

    expect(pointsInOrder, ['9 pts', '6 pts', '3 pts']);
    expect(tester.takeException(), isNull);
  });
}
