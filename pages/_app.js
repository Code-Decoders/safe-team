import '../styles/globals.css'
import { useEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components'



function MyApp({ Component, pageProps }) {

  const [theme, setTheme] = useState(null)

  useEffect(() => {
    async function get() {
      await import('@gnosis.pm/safe-react-components').then(val => {
        console.log(val.theme)
        setTheme(val.theme)
      })
    }
    get()
  }, [])
  if (theme === null) return (<div>Loading...</div>)
  return (
    // <SafeThemeProvider mode="dark">
    //   {(safeTheme) => (
    // <BoardDynamic>
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
    // </BoardDynamic>
    // )}
    // </SafeThemeProvider>
  )
}

export default MyApp
