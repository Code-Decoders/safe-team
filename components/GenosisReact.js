import dynamic from "next/dynamic";

export const GenericModal = dynamic(() => import('@gnosis.pm/safe-react-components').then(val => val.GenericModal), {
    ssr: false,
})

export const Button = dynamic(() => import('@gnosis.pm/safe-react-components').then(val => val.Button), {
    ssr: false,
})

export const TextFieldInput = dynamic(() => import('@gnosis.pm/safe-react-components').then(val => val.TextFieldInput), {
    ssr: false,
})


