enum AUTH_ERROR_MESSAGE {
  EMAIL_IN_USE = 'Email already in use.',
  EMAIL_NOT_FOUND = 'Authentification failed. User with this email is not found.',
  INVALID_PASSWORD = 'Authentification failed. Invalid password.',
}

enum MIDDLEWARE_ERROR_MESSAGE {
  ONLY_FOR_ADMIN = 'Only for admin.',
  HEADER_IS_MISSING = 'Authorization header is missing.',
  INVALID_TOKEN = 'Invalid authorization token.',
  TOKEN_IS_MISSNG = 'Authorization token expired',
  API_ENDPOINT_NOT_FOUND = 'API endpoint not found',
}

enum USERS_ERROR_MESSAGE {
  NOT_FOUND = 'User is not found.',
}

enum GAMES_ERROR_MESSAGE {
  NO_GAMES = 'You are not have a games.',
  GAME_NOT_FOUND = 'Game is not found.',
  NOT_WITH_YOURSELF = 'You can not create a game with yourself.',
  OPPONENT_NOT_FOUND = 'Opponent is not found.',
  GAME_ALREADY_CREATED = 'Game with this user is already created.',
  NOT_DELETE_AFTER_START = 'You cannot delete game after game start.',
  NOT_DELETE_FINISHED = 'You cannot delete finished game.',
  GAME_NOT_DELETED = 'Sorry, game is not deleted.',
  NOT_CHANGE_HIDDEN_AFTER_START = 'You cannot change answer after game start.',
  NOT_CHANGE_HIDDEN_FINISHED = 'You cannot change answer in finished game.',
  INCORRECT_ANSWER_LENGTH = 'Incorrect answer length.',
  NOT_STEP_AFTER_FINISHED = 'You cannot make a step after the game is over.',
  INCORRECT_STEP_LENGTH = 'Incorrect step length.',
  NOT_YOU_TURN = "It's not your turn to make a move.",
  NOT_CHANGE_SETTINGS_AFTER_START = 'You cannot change settings after game start.',
  NOT_CHANGE_SETTINGS_FINISHED = 'You cannot change settings in finished game.',
  NOT_A_MEMBER = 'You are not a member of this game.',
  NOT_A_CREATOR = 'You are not a creator of this game.',
  NOT_CHANGE_OPPONENT_AFTER_START = 'You cannot change opponent after game start.',
}

export { AUTH_ERROR_MESSAGE, MIDDLEWARE_ERROR_MESSAGE, USERS_ERROR_MESSAGE, GAMES_ERROR_MESSAGE };
