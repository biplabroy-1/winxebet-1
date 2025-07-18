"use client";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import GameOpeningLoader from "@/components/loader/GameOpeningLoader";

import { useOpenGameMutation } from "@/lib/features/gamesApiSlice";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Play = () => {
  const [openGame, { isLoading }] = useOpenGameMutation();
  const [isIframeLoading, setIsLoading] = useState(true);
  const gameId = useSearchParams().get("gameId") || "";

  const [iframe, setIframe] = useState("");

  const [error, setError] = useState(false);

  useEffect(() => {
    openGame({ gameId, demo: "0" })
      .unwrap()
      .then((res) => {
        if (res) {
          const url = res.content.game.url;
          const iframeMode = res.content.game.iframe;
          if (iframeMode == "0") {
            location.href = url;
          } else {
            console.log("url ", url);
            setIframe(url);
          }
        }
      })
      .catch((error) => {
        console.log("Opend game error ", error);
        setError(true);
      });
  }, [gameId]);

  return (
    <div>
      {(isLoading || isIframeLoading) && !error && <GameOpeningLoader />}
      {!isLoading && !error && iframe && (
        <div className="w-full h-screen ">
          <iframe
            src={iframe}
            className="w-full h-full border-0 rounded-b-lg"
            onLoad={() => setIsLoading(false)}
            allowFullScreen
          />
        </div>
      )}
      {!isLoading && error && (
        <div className="w-full h-screen bg-[#006165] flex justify-center items-center">
          <div className="w-[280px] md:w-[320px] lg:w-[350px] bg-white overflow-hidden rounded-xl">
            <div className="h-[70%] w-full bg-red-500 px-8 py-2">
              <h3 className="text-2xl font-semibold text-white">Error</h3>

              <p className="text-sm font-normal text-white tracking-wide">
                Game is not available
              </p>
            </div>

            <div className="flex justify-end items-end pb-4 pr-4">
              <Link href="/" className="mt-4">
                <SecondaryButton>Go Home</SecondaryButton>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Play;
