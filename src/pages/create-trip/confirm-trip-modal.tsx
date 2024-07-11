import { Mail, User, X } from "lucide-react"
import { FormEvent } from "react"
import { Button } from "../../components/button"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ConfirmTripModalProps {
  handleConfirmTripModal: () => void
  createTrip: (event: FormEvent<HTMLFormElement>) => void
  setOwnerName: (name: string) => void
  setOwnerEmail: (email: string) => void
  infoTrip: {
    destination: string
    eventStartAndEndDates: DateRange | undefined
  }
}

export function ConfirmTripModal({
  handleConfirmTripModal,
  createTrip,
  setOwnerName,
  setOwnerEmail,
  infoTrip
}: ConfirmTripModalProps) {

  const displayedDate =
    infoTrip?.eventStartAndEndDates?.from && infoTrip?.eventStartAndEndDates?.to
      ? format(infoTrip.eventStartAndEndDates.from, "d 'de' LLLL 'de' yyyy", { locale: ptBR })
        .concat(' até ').concat(format(infoTrip.eventStartAndEndDates.to, "d 'de' LLLL 'de' yyyy", { locale: ptBR }))
      : "data";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[960px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-lg font-semibold">Confirmar criação de viagem</h2>
            <button onClick={handleConfirmTripModal} type="button">
              <X className="size-5 text-zinc-400" />
            </button>
          </div>

          <p className="text-sm text-zinc-400">
            Para concluir a criação da viagem para {''}
            <span className="font-semibold text-zinc-100">
              {infoTrip?.destination || "destino"}
            </span>
            {''} nas datas de {''}
            <span className="font-semibold text-zinc-100">
              {displayedDate}
            </span>
            {','} preencha seus dados abaixo:
          </p>
        </div>

        <form onSubmit={createTrip} className="space-y-3">

          <div className="h-14 px-4 bg-zinc-950 border-zinc-800 rounded-lg flex items-center gap-2">
            <User className="text-zinc-400 size-5" />
            <input
              type="text"
              name="name"
              placeholder="Seu nome completo"
              className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
              onChange={event => setOwnerName(event.target.value)}
            />
          </div>

          <div className="h-14 px-4 bg-zinc-950 border-zinc-800 rounded-lg flex items-center gap-2">
            <Mail className="text-zinc-400 size-5" />
            <input
              type="email"
              name="email"
              placeholder="Seu email pessoal"
              className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1"
              onChange={event => setOwnerEmail(event.target.value)}
            />
          </div>

          <Button type="submit" variant="primary" size='full'>
            Confirmar criação da viagem
          </Button>
        </form>
      </div>
    </div>
  )
}
