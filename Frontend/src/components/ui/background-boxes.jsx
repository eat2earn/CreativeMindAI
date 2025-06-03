import React, { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const BoxesCore = ({ className, ...rest }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const rows = new Array(100).fill(0);
    const cols = new Array(50).fill(0);

    const colors = [
        "#93c5fd", "#f9a8d4", "#86efac",
        "#fde047", "#fca5a5", "#d8b4fe",
        "#a5b4fc", "#c4b5fd"
    ];

    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

    return (
        <div
            style={{
                transform: "translate(-50%,-50%) skewX(-48deg) skewY(14deg) scale(0.8)",
                width: "200%",
                height: "200%",
            }}
            className={cn(
                "absolute top-1/2 left-1/2 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4",
                className
            )}
            {...rest}
        >
            {rows.map((_, i) => (
                <motion.div 
                    key={i} 
                    className="relative h-8 w-16 border-l border-slate-700/30"
                >
                    {cols.map((_, j) => (
                        <motion.div
                            key={j}
                            whileHover={{
                                backgroundColor: getRandomColor(),
                                transition: { duration: 0 },
                            }}
                            animate={{
                                opacity: mounted ? 0.5 : 0,
                                transition: { duration: 2 },
                            }}
                            className="relative h-8 w-16 border-t border-r border-slate-700/30"
                        >
                            {j % 2 === 0 && i % 2 === 0 && (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1px] text-slate-700/30"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                                </svg>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            ))}
        </div>
    );
};

export const Boxes = memo(BoxesCore);
