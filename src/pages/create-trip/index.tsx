import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { InviteGuestsModal } from "./invite-guests-modal"
import { ConfirmTripModal } from "./confirm-trip-modal"
import { DestinationAndDateStep } from "./steps/destination-and-date-step"
import { InviteGuestsStep } from "./steps/invite-guests-step"
import { DateRange } from "react-day-picker"
import { api } from "../../lib/axios"

export function CreateTripPage() {
  const navigate = useNavigate()

  const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false)
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false)
  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false)

  const [destination, setDestination] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange | undefined>()


  const handleGuestsInputModal = () => {
    setIsGuestsInputOpen(!isGuestsInputOpen)
  }

  const handleGuestsModal = () => {
    setIsGuestsModalOpen(!isGuestsModalOpen)
  }

  const handleConfirmTripModal = () => {
    setIsConfirmTripModalOpen(!isConfirmTripModalOpen)
  }

  const addNewEmailInvite = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const email = data.get('email')?.toString()

    if (!email) {
      return
    }

    if (emailsToInvite.includes(email)) {
      return
    }

    setEmailsToInvite([
      ...emailsToInvite,
      email
    ])

    event.currentTarget.reset()
  }

  const removeEmailFromInvites = (emailToRemove: string) => {
    const newEmailList = emailsToInvite.filter(email => email !== emailToRemove)
    setEmailsToInvite(newEmailList)
  }

  const createTrip = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // console.log(destination);
    // console.log(eventStartAndEndDates);
    // console.log(emailsToInvite);
    // console.log(ownerEmail);
    // console.log(ownerName);

    const validation = !destination || !eventStartAndEndDates?.from || !eventStartAndEndDates?.to
      || emailsToInvite.length === 0 || !ownerName || !ownerEmail

    if (validation) {
      return
    }

    const response = await api.post('/trips', {
      destination,
      starts_at: eventStartAndEndDates.from,
      ends_at: eventStartAndEndDates.to,
      emails_to_invite: emailsToInvite,
      owner_name: ownerName,
      owner_email: ownerEmail
    })

    const { tripId } = response.data //{"tripId":"17c25962-ee47-4fd9-88a3-473d50597696"}

    navigate(`/trips/${tripId}`)
  }

  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">

        <div className="flex flex-col items-center gap-3">
          <img src="/logo/Logo.png" alt="planner" />
          <p className="text-zinc-50 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
        </div>

        <div className="space-y-4">

          <DestinationAndDateStep
            handleGuestsInputModal={handleGuestsInputModal}
            isGuestsInputOpen={isGuestsInputOpen}
            setDestination={setDestination}
            setEventStartAndEndDates={setEventStartAndEndDates}
            eventStartAndEndDates={eventStartAndEndDates}
          />

          {isGuestsInputOpen && (
            <InviteGuestsStep
              handleGuestsModal={handleGuestsModal}
              handleConfirmTripModal={handleConfirmTripModal}
              emailsToInvite={emailsToInvite}
            />
          )}
        </div>

        <p className="text-sm text-zinc-500">Ao planejar sua viagem pela plann.er você automaticamente concorda <br />
          com nossos <a className="text-zinc-300 underline" href="#">termos de uso</a> e <a className="text-zinc-300 underline" href="#">políticas de privacidade</a>.</p>
      </div>


      {isGuestsModalOpen && (
        <InviteGuestsModal
          emailsToInvite={emailsToInvite}
          addNewEmailInvite={addNewEmailInvite}
          handleGuestsModal={handleGuestsModal}
          removeEmailFromInvites={removeEmailFromInvites}
        />
      )}

      {isConfirmTripModalOpen && (
        <ConfirmTripModal
          handleConfirmTripModal={handleConfirmTripModal}
          createTrip={createTrip}
          setOwnerName={setOwnerName}
          setOwnerEmail={setOwnerEmail}
          infoTrip={{ destination, eventStartAndEndDates }}
        />
      )}

    </div>
  )
}

