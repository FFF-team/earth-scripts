import React from 'react'


const enhanceApp = ({
                        initialData
                    }) => {
    return (Component) =>
        class InnerApp extends React.Component {
            render() {
                return (
                    <Component
                        initialData={initialData}
                    />
                )
            }

    }
};



module.exports =  enhanceApp