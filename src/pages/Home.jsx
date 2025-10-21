import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Select from 'react-select';
import { BsStars } from "react-icons/bs";
import { HiOutlineCode } from "react-icons/hi";
import Editor from '@monaco-editor/react';
import { IoCopy } from "react-icons/io5";
import { PiExportBold } from "react-icons/pi";
import { ImNewTab } from "react-icons/im";
import { FiRefreshCcw } from "react-icons/fi";
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { IoMdClose } from "react-icons/io";

const Home = () => {
    const options = [
        { value: 'html-css', label: 'HTML + CSS' },
        { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
        { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
        { value: 'html-css-js', label: 'HTML + CSS + JS' },
        { value: 'js-react.js', label: 'Js + React.js' },
        { value: 'html-tailwind-bootstrap', label: 'HTML + Tailwind + Bootstrap' },
    ];

    const [outputScreen, setOutputScreen] = useState(false);
    const [tab, setTab] = useState(1);
    const [prompt, setPrompt] = useState("");
    const [frameWork, setFrameWork] = useState(options[0]);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [isNewTabOpen, setIsNewTabOpen] = useState(false);

    function extractCode(response) {
        const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
        return match ? match[1].trim() : response.trim();
    };

    // The client gets the API key from the environment variable `GEMINI_API_KEY`.
    const ai = new GoogleGenAI({ apiKey: "AIzaSyAsVwI5LELoCOWfuXCGHiay_HGrKr2P5M0" });

    async function getResponse() {
        setLoading(true);
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

Now, generate a UI component for: ${prompt}  
Framework to use: ${frameWork.value}  

Requirements:  
The code must be clean, well-structured, and easy to understand.  
Optimize for SEO where applicable.  
Focus on creating a modern, animated, and responsive UI design.  
Include high-quality hover effects, shadows, animations, colors, and typography.  
Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
Do NOT include explanations, text, comments, or anything else besides the code.  
And give the whole code in a single HTML file.`,
        });
        console.log(response.text);
        setCode(extractCode(response.text));
        setOutputScreen(true);
        setLoading(false);
    };

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(code);
            toast.success("Code copied to Clipboard");
        } catch (err) {
            console.error('Failed to copy: ', err);
            toast.error("Failed to copy");
        }
    };

    const downloadFile = () => {
        const fileName = "GenUI-Code.html"
        const blob = new Blob([code], { type: 'text/plain' });
        let url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("File downloaded");
    };

    return (
        <>
            <Navbar />
            <div className="flex items-center px-[100px] justify-between gap-[30px]">
                <div className="left w-[50%] h-[auto] py-[30px] rounded-xl bg-neutral-900 mt-5 p-[20px]">
                    <h3 className="text-[20px] font-semibold sp-text">AI component generator</h3>
                    <p className="text-[gray] mt-2 text-[16px]">Describe your component and let AI create create it for you</p>
                    <p className="text-[15px] font-[700] mt-3">Framework</p>
                    <Select
                        className="mt-2"
                        options={options}
                        placeholder="Select an option"
                        styles={{
                            control: (base, state) => ({
                                ...base,
                                backgroundColor: "#0a0a0a",
                                borderColor: state.isFocused ? "#555" : "#222",
                                boxShadow: state.isFocused ? "0 0 0 1px #555" : "none",
                                color: "#fff",
                                "&:hover": { borderColor: "#777" },
                            }),
                            menu: (base) => ({
                                ...base,
                                backgroundColor: "#0a0a0a",
                                color: "#fff",
                                border: "1px solid #222",
                            }),
                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isFocused
                                    ? "#1a1a1a"
                                    : state.isSelected
                                        ? "#333"
                                        : "#0a0a0a",
                                color: "#fff",
                                cursor: "pointer",
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: "#fff",
                            }),
                            placeholder: (base) => ({
                                ...base,
                                color: "#888",
                            }),
                            dropdownIndicator: (base) => ({
                                ...base,
                                color: "#aaa",
                                "&:hover": { color: "#fff" },
                            }),
                            indicatorSeparator: (base) => ({
                                ...base,
                                backgroundColor: "#333",
                            }),
                            input: (base) => ({
                                ...base,
                                color: "#fff",
                            }),
                        }}
                        onChange={(e) => {
                            setFrameWork(e.value);
                        }}
                    />
                    <p className="text-[15px] font-[700] mt-5">Describe your component</p>
                    <textarea onChange={(e) => { setPrompt(e.target.value) }} value={prompt} className="w-full min-h-[200px] rounded-xl bg-black mt-3 p-[10px]" placeholder="Describe your component and let AI code for you"></textarea>
                    <div className="flex items-center justify-between">
                        <p className="text-[gray]">Click on generate button to generate your code</p>
                        <button onClick={getResponse} className="generate flex items-center p-[10px] rounded-lg border-0 mt-3 bg-gradient-to-r from-purple-400  to-purple-700 px-[20px] gap-[8px] transition-all hover:opacity-[.8]">
                            {
                                loading === false ?
                                    <>
                                        <i><BsStars /></i>
                                    </> : ""
                            }
                            {
                                loading === true ?
                                    <>
                                        <ClipLoader color='white' size={20} />
                                    </> : ""
                            }
                            Generate</button>
                    </div>
                </div>
                <div className="right relative mt-2 left w-[50%] h-[80vh] bg-neutral-900 rounded-xl">
                    {
                        outputScreen === false ?
                            <>
                                <div className="skeleton w-full h-full flex items-center flex-col justify-center">
                                    <div className="circle p-[20px] w-[70px] h-[70px] flex items-center justify-center text-[30px] rounded-[50%] bg-gradient-to-r from-purple-400  to-purple-700"><HiOutlineCode /></div>
                                    <p className="text-[16px] text-[gray] mt-1">Your component with code will appear here</p>
                                </div>
                            </> : <>
                                <div className="top bg-neutral w-full h-[60px] flex items-center gap-[15px] px-[20px]">
                                    <button onClick={() => { setTab(1) }} className={`btn w-[50%] p-[10px] rounded-xl cursor-pointer transition-all ${tab === 1 ? "bg-[#333]" : ""}`}>Code</button>
                                    <button onClick={() => { setTab(2) }} className={`btn w-[50%] p-[10px] rounded-xl cursor-pointer transition-all ${tab === 2 ? "bg-[#333]" : ""}`}>Preview</button>
                                </div>
                                <div className="top-2 bg-neutral w-full h-[60px] flex items-center justify-between gap-[15px] px-[20px]">
                                    <div className="left">
                                        <p className="font-bold">Code Editor</p>
                                    </div>
                                    <div className="right flex items-center gap-[10px]">
                                        {
                                            tab === 1 ?
                                                <>
                                                    <button className="copy w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={copyCode}><IoCopy /></button>
                                                    <button className="export w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={downloadFile}><PiExportBold /></button>
                                                </> :
                                                <>
                                                    <button className="copy w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={() => { setIsNewTabOpen(true) }}><ImNewTab /></button>
                                                    <button className="export w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]"><FiRefreshCcw /></button>
                                                </>
                                        }

                                    </div>
                                </div>
                                <div className="editor h-full">
                                    {
                                        tab === 1 ?
                                            <>
                                                <Editor value={code} height="100%" theme='vs-dark' language="html" />
                                            </> :
                                            <>
                                                <iframe srcDoc={code} className="preview w-full h-full bg-white text-black flex items-center justify-center"></iframe>
                                            </>
                                    }
                                </div>
                            </>
                    }
                </div>
            </div>

            {
                isNewTabOpen === true ?
                    <>
                        <div className="container absolute left-0 top-0 right-0 bottom-0 bg-white w-screen min-h-screen overflow-auto">
                            <div className="top text-black w-full h-[60px] flex items-center justify-between px-[20px]">
                                <div className="left">
                                    <p className="font-bold">Preview</p>
                                </div>
                                <div className="right flex items-center gap-[10px]">
                                    <button className="copy w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all" onClick={() => { setIsNewTabOpen(false) }}><IoMdClose /></button>
                                </div>
                            </div>
                            
                            <iframe srcDoc={code} className="w-full h-full "></iframe>

                        </div>
                    </> : ""
            }
        </>
    )
}

export default Home;