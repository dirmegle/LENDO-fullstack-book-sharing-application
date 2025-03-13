export default function Footer() {
    const currentYear = new Date().getFullYear();
  return (
    <div>
      <p>{`©Lendo ${currentYear}`}</p>
    </div>
  )
}