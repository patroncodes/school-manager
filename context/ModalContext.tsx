'use client'

import { createContext, useContext, useState } from "react";

type ModalProps = 'create' | 'update' | 'delete'

type IContextType = {
    modalToOpen: {
        type: ModalProps;
        id?: string;
    } | null;
    setModalToOpen: React.Dispatch<React.SetStateAction<{
        type: ModalProps;
        id?: string;
    } | null>>
};

const INITIAL_STATE: IContextType = {
    modalToOpen: { type: 'create' },
    setModalToOpen: () => { },
};

const ModalContext = createContext<IContextType>(INITIAL_STATE);

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [modalToOpen, setModalToOpen] = useState<{ type: ModalProps; id?: string } | null>(null);

    return (
        <ModalContext.Provider value={{ modalToOpen, setModalToOpen }}>
            {children}
        </ModalContext.Provider>
    );
}

export const useModalContext = () => useContext(ModalContext);