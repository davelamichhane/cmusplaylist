export const uuid = () => {
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let returnVal = ""
  for (let i = 0; i < 4; i++) {
    returnVal += characters[Math.floor(Math.random() * 36)]
  }
  return returnVal
}
