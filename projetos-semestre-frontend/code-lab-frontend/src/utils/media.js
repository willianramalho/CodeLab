/**
 * Monta a URL pública completa de uma foto de perfil a partir do nome de
 * arquivo salvo no banco (ex: "default-profile.png"). A base usada aqui é
 * VITE_API_BASE_URL (a raiz da API, sem o /api), porque a pasta de uploads é
 * servida por fora do prefixo /api (ver express.static em app.js).
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function getProfilePhotoUrl(filename) {
  if (!filename) {
    return `${API_BASE_URL}/uploads/profiles/default-profile.png`
  }

  return `${API_BASE_URL}/uploads/profiles/${filename}`
}
