import './globals.css'
export default function App(props: {Component: any, pageProps: any}) {
    return <props.Component {...props.pageProps} />;
}
