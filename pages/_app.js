import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'

function MyApp({ Component, pageProps }) {
	return (
		<div>
			<Toaster />
			<Component {...pageProps} />
		</div>

	)}

export default MyApp
