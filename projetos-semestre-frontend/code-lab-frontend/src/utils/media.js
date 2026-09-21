/**
 * Monta a URL pública completa de uma foto de perfil a partir do nome de
 * arquivo salvo no banco (ex: "default-profile.png"). A base usada aqui é
 * VITE_UPLOADS_BASE_URL, que já aponta para a pasta de uploads servida por
 * fora do prefixo /api (ver express.static em app.js), e já inclui o
 * segmento "/uploads" — por isso não é concatenado de novo aqui.
 */

const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_BASE_URL

export function getProfilePhotoUrl(filename) {
  if (!filename) {
    return `${UPLOADS_BASE_URL}/profiles/default-profile.png`
  }

  return `${UPLOADS_BASE_URL}/profiles/${filename}`
}
