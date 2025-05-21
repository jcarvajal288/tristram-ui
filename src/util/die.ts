const die = (max: number) => Math.floor(Math.random() * (max + 1)) + 1

export const d6 = () => die(6)

export const d10 = () => die(10)
