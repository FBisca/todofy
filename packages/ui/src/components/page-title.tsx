interface Props {
  children: React.ReactNode
}

function PageTitle({ children }: Props) {
  return <h1 className="text-2xl font-bold">{children}</h1>
}

export { PageTitle }
