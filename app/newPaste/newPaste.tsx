import { useState } from "react";
import AES256 from "../utils/aes256";
import Modal from "../Modal";
import Loading from "..//Loading";

export function NewPaste() {
    const [isChecked, setIsChecked] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccessFull, setIsSuccessFull] = useState<boolean>(false);
    const [isUnSuccessFull, setIsUnSuccessFull] = useState<boolean>(false);

    const [pasteUrl, setPasteUrl] = useState<string>("null");
    const [error, setError] = useState<string>("error");

    const [noPasswordModal, setNoPasswordModal] = useState(false);
    const handleCheckboxChange = (event: any): void => {
        setIsChecked(event.target.checked);
    };
    const handleSubmit = (event: any): void => {
        const encryptionCode = document.getElementById(
            "encryption_code"
        ) as HTMLInputElement;
        const message = document.getElementById("message") as HTMLInputElement;
        const doEncrypt = document.getElementById(
            "encrypt-checkbox"
        ) as HTMLInputElement;
        const doShorten = document.getElementById(
            "shorten-checkbox"
        ) as HTMLInputElement;

        console.log(
            encryptionCode.value,
            message.value,
            doEncrypt.checked,
            doShorten.checked
        );

        let finalMessage = message.value;
        if (doEncrypt.checked) {
            if (encryptionCode.value === "") {
                setIsLoading(false);
                setNoPasswordModal(true);
                return;
            }
            const aes256 = new AES256(encryptionCode.value);
            finalMessage = aes256.encrypt(message.value);
        }

        if (doShorten.checked) {
            fetch("https://encryptifyapi.floppy.us.kg/paste", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: finalMessage,
                    encrypted: doEncrypt.checked,
                    url: Math.random().toString(36).substring(2, 6),
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    setPasteUrl("?id=" + data.url);
                    setIsSuccessFull(true);
                })
                .catch((error) => {
                    setIsUnSuccessFull(true);
                    setError(error.message);
                    console.error(error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setPasteUrl("?data=" +btoa(finalMessage + "|||" + doEncrypt.checked));
            setIsSuccessFull(true)
            setIsLoading(false);
        }
    };

    return (
        <main className="flex items-center justify-center p-10 pt-0 h-[90vh]">
            <Loading open={isLoading}></Loading>

            <div className="w-full h-full grid md:grid-cols-4 md:grid-rows-1 gap-5 grid-cols-1 grid-rows-3">
                <div className="bg-surface-a10 rounded-3xl md:col-span-3 row-span-2">
                    <textarea
                        id="message"
                        className="w-full h-full resize-none bg-surface-a10 rounded-3xl p-5 focus:outline-1 focus:outline-surface-a20"
                        placeholder="Type anything :)"></textarea>
                </div>

                <div className="p-10">
                    <div>
                        <div className="flex items-center justify-start gap-10">
                            <p>Encrypt Paste</p>
                            <input
                                defaultChecked
                                id="encrypt-checkbox"
                                type="checkbox"
                                value=""
                                className="w-4 h-4 accent-primary-a20"
                                onChange={handleCheckboxChange}
                            />
                        </div>
                        <input
                            type="text"
                            id="encryption_code"
                            className={`mt-3 bg-surface-a10 border border-surface-a20 text-sm rounded-lg focus:ring-surface-a30 focus:outline-surface-a30 block w-full p-2.5 ${
                                !isChecked
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                            placeholder="Encryption Code"
                            required
                            disabled={!isChecked}
                        />
                    </div>

                    <div className="mt-8">
                        <div className="flex items-center justify-start gap-10">
                            <p>Shorten Link</p>
                            <input
                                defaultChecked
                                id="shorten-checkbox"
                                type="checkbox"
                                value=""
                                className="w-4 h-4 accent-primary-a20"
                            />
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            className="p-3 w-full rounded-xl bg-primary-a20 font-bold text-lg"
                            onClick={() => {
                                setIsLoading(true);
                                setTimeout(() => {
                                    handleSubmit(event);
                                }, 500);
                            }}>
                            Create Paste
                        </button>
                    </div>
                </div>
            </div>

            <Modal
                open={noPasswordModal}
                onClose={() => setNoPasswordModal(false)}>
                <div className="text-center w-64 flex flex-col">
                    <p className="text-red-500 font-bold text-2xl self-start">
                        Error
                    </p>
                    <p className="text-gray-200 font-normal self-start mt-2">
                        Please enter an encryption code
                    </p>
                </div>
            </Modal>

            <Modal open={isSuccessFull} onClose={() => setIsSuccessFull(false)}>
                <div className="text-center w-auto flex flex-col p-5">
                    <p className="text-green-500 font-bold text-2xl self-start">
                        Paste Created!
                    </p>
                    <p className="text-gray-200 font-normal self-start mt-2 text-xl text-start w-full">
                        Your Paste is available <wbr></wbr>
                        <a
                            href={
                                "https://encryptify.floppy.us.kg/paste" +
                                pasteUrl
                            }
                            className="text-blue-400 w-full">
                            here
                        </a>
                    </p>
                </div>
            </Modal>

            <Modal
                open={isUnSuccessFull}
                onClose={() => setIsUnSuccessFull(false)}>
                <div className="text-center w-auto flex flex-col p-5">
                    <p className="text-red-500 font-bold text-2xl self-start">
                        Error!
                    </p>
                    <p className="text-gray-200 font-normal self-start mt-2 text-xl">
                        {error}
                    </p>
                </div>
            </Modal>

            <Loading open={isLoading}></Loading>
        </main>
    );
}
