const avatarModules = import.meta.glob('./*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const defaultAvatar = '0.svg'

export const avatars = Object.entries(avatarModules)
  .map(([path, src]) => {
    const fileName = path.split('/').pop()

    return {
      id: fileName,
      src,
      label: `Avatar ${fileName.replace('.svg', '')}`,
    }
  })
  .sort((firstAvatar, secondAvatar) => {
    const firstNumber = Number.parseInt(firstAvatar.id, 10)
    const secondNumber = Number.parseInt(secondAvatar.id, 10)

    return firstNumber - secondNumber
  })

export function getAvatarSrc(avatarId) {
  return avatars.find((avatar) => avatar.id === avatarId)?.src || avatars[0]?.src
}
