import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const ModalForm = ({ isOpen, onClose, title, children }) => {
    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Backdrop */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                </Transition.Child>

                {/* Modal container */}
                <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0 scale-95 translate-y-4"
                        enterTo="opacity-100 scale-100 translate-y-0"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100 scale-100 translate-y-0"
                        leaveTo="opacity-0 scale-95 translate-y-4"
                    >
                        <Dialog.Panel
                            className="
                                w-full 
                                max-w-md 
                                sm:max-w-lg 
                                rounded-xl 
                                bg-white 
                                p-4 
                                sm:p-6 
                                md:p-8 
                                shadow-xl 
                                transition-all
                                max-h-[90vh]
                                overflow-y-auto
                            "
                        >
                            {title && (
                                <Dialog.Title className="text-lg font-semibold mb-4">
                                    {title}
                                </Dialog.Title>
                            )}
                            <div>{children}</div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ModalForm;
