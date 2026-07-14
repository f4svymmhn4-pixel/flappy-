/// Which flow the player picked from the play-mode screen. Purely a
/// client-side concept — it decides which RPC play_setup's execution
/// controller calls, it isn't sent to the server as-is.
enum PlayMode { quickMatch, createPrivate, joinPrivate, solo }
