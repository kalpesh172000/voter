import { ActionGetResponse } from '@solana/actions'

export const getPoll = async (req, res, next) => {
    try {
        const actionMetaData: ActionGetResponse = {
            icon: 'https://images.unsplash.com/photo-1739403386250-080677ac4c53?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            title: 'red and orange',
            decription: 'choose your favourite colour',
            label: 'vote',
            links: {
                actions: [
                    {
                        label: 'Red',
                        href: '/api/vote?candidate=Red',
                    },
                    {
                        label: 'Orange',
                        href: '/api/vote?candidate=Orange',
                    },
                ],
            },
        }
        return res.status(200).json(actionMetaData)
    } catch (error) {
        next(error)
    }
}
