enum AUTHENTIFICATION_ERROR_MESSAGE {
  EMAIL_IN_USE = 'Email already in use.',
  EMAIL_NOT_FOUND = 'Authentification failed. User with this email is not found.',
  INVALID_PASSWORD = 'Authentification failed. Invalid password.',
}

enum AUTHORIZATION_ERROR_MESSAGE {
  HEADER_IS_MISSING = 'Authorization header is missing.',
  INVALID_TOKEN = 'Invalid authorization token.',
  TOKEN_IS_MISSING = 'Authorization token expired',
  NOT_AVAILABLE_FOR_YOU_ROLE = "It's not available for your role.",
}

enum API_ERROR_MESSAGE {
  API_ENDPOINT_NOT_FOUND = 'API endpoint not found',
}

enum USERS_ERROR_MESSAGE {
  NOT_FOUND = 'User is not found.',
}

enum GAMES_ERROR_MESSAGE {
  GAME_NOT_FOUND = 'Game is not found.',
  OPPONENT_NOT_FOUND = 'Opponent is not found.',
  GAME_ALREADY_CREATED = 'Game with this user is already created.',
  INCORRECT_ANSWER_LENGTH = 'Incorrect answer length.',
  INCORRECT_STEP_LENGTH = 'Incorrect step length.',
  NOT_YOU_TURN = "It's not your turn to make a move.",
  NOT_A_MEMBER = 'You are not a member of this game.',
  NOT_A_CREATOR = 'You are not a creator of this game.',
  CANNOT_WITH_YOURSELF = 'You cannot create a game with yourself.',
  CANNOT_DELETE = 'You cannot delete game after game start or finished.',
  CANNOT_CHANGE_OPPONENT = 'You cannot change opponent after game start or finished.',
  CANNOT_CHANGE_SETTINGS = 'You cannot change settings after game start or finished.',
  CANNOT_CHANGE_HIDDEN = 'You cannot change answer after game start or finished.',
  CANNOT_MAKE_STEP_AFTER_FINISHED = 'You cannot make a step after the game is over.',
}

export {
  AUTHENTIFICATION_ERROR_MESSAGE,
  AUTHORIZATION_ERROR_MESSAGE,
  API_ERROR_MESSAGE,
  USERS_ERROR_MESSAGE,
  GAMES_ERROR_MESSAGE,
};
