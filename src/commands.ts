import { initialize, pushExcel ,pullExcel, openBook, callMacro } from './api'

type Init = {
  (): void
}

type Push = {
  (): void
}

type Pull = {
  (): void
}

type OpenBook = {
  (): void
}

export const init: Init = () => {
  initialize()
}

export const push: Push = () => {
  pushExcel()
}

export const pull: Pull = () => {
  pullExcel()
}

export const openbook: OpenBook = () => {
  openBook()
}