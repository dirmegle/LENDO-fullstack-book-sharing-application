interface NoResultsMessageProps {
  illustrationLink: string
  message: string
}

export default function NoResultsMessage({ illustrationLink, message }: NoResultsMessageProps) {
  return (
    <div className="flex flex-col-reverse lg:flex-row p-4 justify-center items-center gap-4">
      <div className="sm:h-64 sm:w-64 w-full h-auto">
        <img src={illustrationLink} alt="No results illustration" />
      </div>
      <p className="font-medium lg:text-left text-center">{message}</p>
    </div>
  )
}
