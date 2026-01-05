import 'react';

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements extends React.JSX.IntrinsicElements { }
    }
}

declare global {
    namespace JSX {
        interface IntrinsicElements extends React.JSX.IntrinsicElements { }
    }
}
