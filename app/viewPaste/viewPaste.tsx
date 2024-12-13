import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import Loading from "../Loading";
import Modal from "../Modal";
import AES128 from "..//utils/aes128";

export function ViewPaste() {
    const [searchParams] = useSearchParams();

    const [open, setOpen] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [finalMessage, setFinalMessage] = useState<string>("");
    const [encryptedMessage, setEncryptedMessage] = useState<string>("");

    const id = searchParams.get("id");
    const data = searchParams.get("data");

    async function getMessage(id: string) {
        const response = await fetch(
            `https://backend.encryptify.floppy.us.kg/paste/${id}`
        );
        const data = await response.json();
        return [data.message, data.encrypted];
    }

    function decryptMessage(message: string, password: string) {
        setOpen(false);
        const aes128 = new AES128(password);
        console.log(message);
        console.log(password);
        const decryptedMessage = aes128.decrypt(message);
        setIsLoading(false);
        if (!decryptedMessage) {
            setOpen(false);
            setError(true);
            return;
        }
        setOpen(false);
        setFinalMessage(decryptedMessage);
    }

    function getInputPassword() {
        const password = document.getElementById(
            "encryption_code"
        ) as HTMLInputElement;
        return password.value;
    }
    useEffect(() => {
        if (data && !id) {
            const decodedMessage = atob(data);
            const messageParts = decodedMessage.split("|||");
            const encryptedPart = messageParts[1];
            console.log(messageParts);
            if (encryptedPart == 'true') {
                setEncryptedMessage(messageParts[0]);
                setIsLoading(false);
                setOpen(true);
            } else {
                setOpen(false);
                setIsLoading(false);
                setFinalMessage(messageParts[0]);
            }
        } else if (!data && id) {
            const fetchData = async () => {
                const [message, encrypted] = await getMessage(id);
                if (encrypted) {
                    setIsLoading(false);
                    setOpen(true);
                    setEncryptedMessage(message);
                } else {
                    setIsLoading(false);
                    setOpen(false);
                    setFinalMessage(message);
                }
            };
            fetchData();
        }
    }, [id, data]); // Runs whenever `id` or `data` changes

    return (
        <div className="p-10 h-screen">
            <Loading open={isLoading}></Loading>
            <div className="w-full h-full ">
                <div className="bg-surface-a10 rounded-3xl h-full">
                    <div
                        id="message"
                        className="w-full h-full resize-none bg-surface-a10 rounded-3xl p-5 focus:outline-1 focus:outline-surface-a20">
                        {finalMessage}
                    </div>
                </div>
            </div>
            <div
                id="password"
                className={`
                    fixed inset-0 flex justify-center items-center transition-colors
                    ${open ? "visible bg-black/20" : "invisible"}
                `}>
                <div
                    className={`
                        bg-surface-a20 rounded-xl shadow p-6 transition-all
                        ${
                            open
                                ? "scale-100 opacity-100"
                                : "scale-125 opacity-0"
                        }
                    `}>
                    <div>
                        <input
                            type="text"
                            id="encryption_code"
                            className="mt-3 bg-surface-a10 border border-surface-a20 text-sm rounded-lg focus:ring-surface-a30 focus:outline-surface-a30 block w-full p-2.5"
                            placeholder="Encryption Password"
                            required
                        />
                        <button
                            className="p-2 w-full rounded-lg bg-primary-a20 font-semibold text-lg mt-5"
                            onClick={() => {
                                setIsLoading(true);
                                setOpen(false);
                                setTimeout(() => {
                                    decryptMessage(
                                        encryptedMessage,
                                        getInputPassword()
                                    );
                                }, 500);
                            }}>
                            Decrypt
                        </button>
                    </div>
                </div>
            </div>

            <Modal open={error} onClose={() => window.location.reload()}>
                <div className="text-center w-auto flex flex-col p-5">
                    <p className="text-red-500 font-bold text-2xl self-start">
                        Error!
                    </p>
                    <p className="text-gray-200 font-normal self-start mt-2 text-xl">
                        Invalid Password
                    </p>
                </div>
            </Modal>
        </div>
    );
}
