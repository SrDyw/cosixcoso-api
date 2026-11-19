"use client";

import Image from "next/image";
import { motion, number } from "framer-motion";
import Picture from "./components/Picture";
import IcHeart from "./icons/IcHeart";
import { useEffect } from "react";
import conffeti from "canvas-confetti";
import Section from "./components/Section";
import BgDecoration from "./components/BgDecoration";
import {
  DateDifferenceType,
  getDateDifference,
  getTotalMinutesFromDayDiff,
} from "@/libs/libs";
import { useRef } from "react";
import Chip from "./components/Chip";
import { useState } from "react";
import EnterAnimation from "./components/EnterAnimaton";
import SimplePicture from "./components/SimplePicture";
import FadeIn from "./components/FadeIn";
import Photographia from "./components/Photographia";
import IcRestart from "./icons/IcRestart";
import IcBackward from "./icons/IcBackward";
import IcForward from "./icons/IcForward";
import IcList from "./icons/IcList";
import IcPlay from "./icons/IcPlay";

export default function Home() {
  const [date, setDate] = useState<DateDifferenceType | null>(null);
  const [inAnimation, setInAnimation] = useState<boolean>(true);

  const [minutes, setMinutes] = useState<number>();

  useEffect(() => {
    const dateDiff = getDateDifference("08/09/2025");
    setDate(dateDiff);
    const timeout = setTimeout(() => {
      setInAnimation(false);
      conffeti({
        particleCount: 50,
        spread: 60,
      });
    }, 1000);

    setMinutes(getTotalMinutesFromDayDiff(dateDiff));

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return inAnimation ? (
    <EnterAnimation />
  ) : (
    <div className="flex min-h-screen max-w-[600px] items-center justify-center flex-col overflow-hidden">
      <Section className="min-h-screen flex justify-center items-center flex-col w-full gap-8">
        <BgDecoration>
          <div className="w-60">
            <img src="imgs/decoration1.webp" className="object-cover" alt="" />
          </div>
          <div className="w-24 absolute bottom-8 right-16 rotate-45">
            <img src="imgs/decoration2.webp" className="object-cover" alt="" />
          </div>
          <div className="size-60 rounded-full bg-red-400 absolute top-0 left-0 blur-3xl opacity-30"></div>
          <div className="size-60 rounded-full bg-purple-400 absolute bottom-0 right-0 blur-3xl opacity-30"></div>
        </BgDecoration>

        <h1 className="text-black text-3xl font-dosis">
          <span>{date?.dayDiff} days</span>
          <p className="text-5xl font-extrabold">together</p>
        </h1>
        <div className="z-10 flex gap-4 relative">
          <Picture
            size={180}
            url="/imgs/d1.jpeg"
            animation={{ initialRotation: -45, targetRotation: -5 }}
          >
            <Chip text="@coso 🗿" />
          </Picture>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0.5, 1, 1.1, 1],
              opacity: 1,
            }}
            transition={{
              scale: {
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              },
              opacity: { duration: 0.5 },
            }}
            className="z-20 size-12 rounded-full bg-white grid place-items-center shadow-2xl absolute left-[50%] bottom-2 translate-x-[-50%] text-[#b87a6b]"
          >
            <IcHeart className="size-8" />
          </motion.div>
          <Picture
            size={180}
            url="/imgs/y1.jpeg"
            animation={{ initialRotation: 45, targetRotation: 5 }}
          >
            <Chip text="@cosi 🧀" />
          </Picture>
        </div>
        <p className="text-black text-4xl font-extrabold font-dosis">
          {date?.d}d / {date?.m}m / {date?.y}y
        </p>
        <p className="absolute bottom-8 left-0 w-[70%] p-8 font-semibold">
          Gracias por estar conmigo y aceptar todo lo que soy ahora, de darme la
          oportunidad de enamorarme como nunca y amar de forma loca {"<3"}
        </p>
      </Section>

      <Section className="mb-24">
        <FadeIn>
          <div className="flex justify-center items-center p-8 flex-col">
            <SimplePicture size={180} url="imgs/dy2.jpeg" className="h-80" />
            <div className="mt-6 flex w-full justify-between items-center ">
              <p className="font-black text-2xl flex flex-col">
                Mi enterna melodia
                <span className="opacity-55 font-extralight text-lg">
                  cosi ft coso
                </span>
              </p>
              <span className="text-red-400">
                <IcHeart className="size-12" />
              </span>
            </div>
            <div className="w-full h-1 bg-black rounded-3xl mt-16 relative">
              <div className="size-4 rounded-full bg-black absolute left-16 top-[50%] translate-y-[-50%]"></div>
            </div>
            <div className="flex justify-between w-full items-center">
              <span>2:24</span>
              <span className="text-2xl">∞</span>
            </div>
            <div className="flex justify-between items-center w-full mt-4">
              <IcList />
              <div className="flex justify-center items-center gap-8">
                <IcBackward />
                <div
                  className="p-4 bg-black text-white rounded-full"
                  onClick={() => alert("🧟‍♀️")}
                >
                  <IcPlay />
                </div>
                <IcForward />
              </div>
              <IcRestart />
            </div>
          </div>
        </FadeIn>
      </Section>
      <Section className="p-8">
        <div className="w-60 absolute right-0 -top-12">
          <img
            src="imgs/decoration1.webp"
            className="object-cover -scale-x-100"
            alt=""
          />
        </div>
        <div className="size-60 rounded-full bg-red-400 absolute top-0 left-0 blur-3xl opacity-30"></div>

        <h2 className="font-black text-4xl mb-8 z-10">Fotitos</h2>
        <div className="flex justify-center items-center gap-6 flex-col z-10">
          <FadeIn>
            <Photographia size={180} url="/imgs/dy.jpeg" date={"16/08/2025"}>
              <div className="mt-8 font-bold">
                <span className="opacity-60">La foto se llama:</span>{" "}
                <strong>no sabemos todo lo que se viene JAJAJA</strong>
              </div>
            </Photographia>
          </FadeIn>

          <FadeIn>
            <Photographia size={40} url="/imgs/vr.jpeg" date="20/08/2025">
              <div className="mt-8 font-bold">
                ¡De las mejores salidas en Cancun!
              </div>
            </Photographia>
          </FadeIn>
          <motion.div
            className="text-5xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -5, 5, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            whileHover={{
              scale: 1.3,
              rotate: 360,
              transition: { duration: 0.8 },
            }}
          >
            🗿🧀
          </motion.div>
          <FadeIn>
            <Photographia size={40} url="/imgs/y2.jpeg">
              <div className="mt-8 font-bold">
                Dio mio que son todas estas bendiciones
              </div>
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, -2, 2, 0],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                whileHover={{
                  scale: 1.3,
                  rotate: 360,
                  transition: { duration: 0.8 },
                }}
                className="absolute w-32 -rotate-30 left-0 bottom-32 shadow-2xl"
              >
                <SimplePicture size={180} url="/imgs/piko.png" />
              </motion.div>
            </Photographia>
          </FadeIn>
          <FadeIn>
            <Photographia size={40} url="/imgs/d2.jpg" date="20/08/2025">
              <div className="mt-8 font-bold">
                ¡Se nota que estaba bueno ese sushi!
              </div>
            </Photographia>
          </FadeIn>
          <FadeIn>
            <Photographia size={40} url="/imgs/dy3.jpg" date="20/08/2025">
              <div className="mt-8 font-bold">
                ¡Ahi lo mas rico de todo ese lugar eramos nosotros tuti!
              </div>
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, -2, 2, 0],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                whileHover={{
                  scale: 1.3,
                  rotate: 360,
                  transition: { duration: 0.8 },
                }}
                className="absolute w-32 rotate-30 -right-16 bottom-24  text-red-400"
              >
                <IcHeart className="size-12" />
              </motion.div>
            </Photographia>
          </FadeIn>

          <FadeIn>
            <Photographia size={40} url="/imgs/dy4.jpg" date="07/09/2025">
              <div className="mt-8 font-bold">
                Definitivamente lo que mas recuerdo es la pose y el "¿puedo?"
                jajaja
              </div>
            </Photographia>
          </FadeIn>

          <div className="w-full flex justify-between items-center ">
            <div className="w-24 rotate-45 shrink-0">
              <img
                src="imgs/decoration2.webp"
                className="object-cover w-full"
                alt=""
              />
            </div>
            <div className="text-end font-bold text-lg mt-6 p-8">
              Tu me <span className="text-red-800">enamoras</span>, por eso me
              aparezco en su casa a buscarla a mala hora...
            </div>
            <div className="size-60 rounded-full bg-purple-400 absolute bottom-0 right-0 blur-3xl opacity-30"></div>
          </div>

          <FadeIn>
            <Photographia size={40} url="/imgs/dy5.jpg" date="21/09/2025">
              <div className="mt-8 font-bold">
                Las videollamadas que hacemos son tan especiales como nosotros,
                como lo de dormir juntos pero a distancia
              </div>
            </Photographia>
          </FadeIn>
          <FadeIn>
            <Photographia size={40} url="/imgs/dy6.jpg" date="09/10/2025">
              <div className="mt-8 font-bold">
                ¡Que se repitan mas salidas de culto como estas!
              </div>
            </Photographia>
          </FadeIn>
        </div>
      </Section>

      <Section className="min-h-screen">
        <div className="w-full h-screen flex items-center justify-center flex-col">
          
          <img src="/imgs/more.webp" alt="" />
          <p className="text-black font-black text-5xl text-center" >¡Vamos por más!</p>
        </div>
      <p className="absolute bottom-0 left-[50%] translate-x-[-50%] opacity-55 p-5">08/11/2025</p>
      </Section>
    </div>
  );
}
