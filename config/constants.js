module.exports = {
    VALIDATION: {
        USERNAME_MIN: 3,
        USERNAME_MAX: 20,
        PASSWORD_MIN: 6,
        BIO_MAX: 255,
        TITLE_MAX: 100,
        DESCRIPTION_MAX: 500
    },
    // Regras de upload do arquivo de código-fonte do Desafio (Aula 07).
    UPLOAD: {
        CHALLENGE_MAX_SIZE: 2 * 1024 * 1024, // 2MB
        CHALLENGE_EXTENSIONS: ['.js', '.ts', '.py', '.java', '.c', '.cpp', '.cs', '.go', '.rb', '.php', '.txt']
    }
};
