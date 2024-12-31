// app/app/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Accordion } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";
import { Profile } from "@/types";
import Authenticate from "@/components/authenticate";
import TextCustomizer from "@/components/editor/text-customizer";

import { PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import { GenerationCountDisplay } from "@/components/GenerationCountDisplay";
import { ImageActionButton } from "@/components/ImageActionButton";

import { removeBackground } from "@imgly/background-removal";

import "@/app/fonts.css";

const Page = () => {
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const [currentUser, setCurrentUser] = useState<Profile>({
    id: "0",
    username: "visiter",
    full_name: "visiter",
    avatar_url: "",
    images_generated: 0,
    paid: true,
    subscription_id: "0",
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageSetupDone, setIsImageSetupDone] = useState(false);
  const [removedBgImageUrl, setRemovedBgImageUrl] = useState<string | null>(
    null
  );
  const [textSets, setTextSets] = useState<Array<any>>([]);
  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);
  const [isAdjusted, setIsAdjusted] = useState(false);
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getCurrentUser = async (userId: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      id: userId,
    }));
  };

  const handleUploadImage = () => {
    if (currentUser && (currentUser.images_generated < 2 || currentUser.paid)) {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } else {
      alert("You have reached the limit of free generations.");
      setIsPayDialogOpen(true);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      await setupImage(imageUrl);
    }
  };

  const setupImage = async (imageUrl: string) => {
    try {
      const imageBlob = await removeBackground(imageUrl);
      const url = URL.createObjectURL(imageBlob);
      setRemovedBgImageUrl(url);
      setIsImageSetupDone(true);

      // if (currentUser) {
      //     await supabaseClient
      //         .from('profiles')
      //         .update({ images_generated: currentUser.images_generated + 1 })
      //         .eq('id', currentUser.id)
      //         .select();
      // }
    } catch (error) {
      console.error(error);
    }
  };

  const addNewTextSet = () => {
    const newId = Math.max(...textSets.map((set) => set.id), 0) + 1;
    setTextSets((prev) => [
      ...prev,
      {
        id: newId,
        text: "edit",
        fontFamily: "Inter",
        top: 0,
        left: 0,
        color: "white",
        fontSize: 200,
        fontWeight: 800,
        opacity: 1,
        shadowColor: "rgba(0, 0, 0, 0.8)",
        shadowSize: 4,
        rotation: 0,
        textAlign: "center",
      },
    ]);
  };

  const handleAttributeChange = (id: number, attribute: string, value: any) => {
    setTextSets((prev) =>
      prev.map((set) => (set.id === id ? { ...set, [attribute]: value } : set))
    );
  };

  const duplicateTextSet = (textSet: any) => {
    const newId = Math.max(...textSets.map((set) => set.id), 0) + 1;
    setTextSets((prev) => [...prev, { ...textSet, id: newId }]);
  };

  const removeTextSet = (id: number) => {
    setTextSets((prev) => prev.filter((set) => set.id !== id));
  };

  const adjustImageColors = (imageData: ImageData, apply: boolean) => {
    const data = imageData.data;
    const brightness = apply ? 1.2 : 1;
    const contrast = apply ? 1.2 : 1;
    const saturation = apply ? 1.2 : 1;

    for (let i = 0; i < data.length; i += 4) {
      // Adjust brightness
      data[i] = Math.min(255, data[i] * brightness);
      data[i + 1] = Math.min(255, data[i + 1] * brightness);
      data[i + 2] = Math.min(255, data[i + 2] * brightness);

      // Adjust contrast
      data[i] = Math.min(255, (data[i] - 128) * contrast + 128);
      data[i + 1] = Math.min(255, (data[i + 1] - 128) * contrast + 128);
      data[i + 2] = Math.min(255, (data[i + 2] - 128) * contrast + 128);

      // Adjust saturation
      const gray = 0.2989 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = Math.min(255, gray + (data[i] - gray) * saturation);
      data[i + 1] = Math.min(255, gray + (data[i + 1] - gray) * saturation);
      data[i + 2] = Math.min(255, gray + (data[i + 2] - gray) * saturation);
    }
    return imageData;
  };

  const renderToCanvas = () => {
    if (!canvasRef.current || !isImageSetupDone) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bgImg = new (window as any).Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.onload = () => {
      // Maintain aspect ratio while fitting to container
      const containerWidth = canvas.parentElement?.clientWidth || canvas.width;
      const scale = (containerWidth / bgImg.width) * 2;
      canvas.width = bgImg.width * scale;
      canvas.height = bgImg.height * scale;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      // Get/save original image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      if (!originalImageData) {
        setOriginalImageData(imageData);
      }

      // Apply color adjustments
      const adjustedData = adjustImageColors(imageData, isAdjusted);
      ctx.putImageData(adjustedData, 0, 0);

      textSets.forEach((textSet) => {
        ctx.save();
        const scaleFactor = scale;
        ctx.font = `${textSet.fontWeight} ${textSet.fontSize * scaleFactor}px ${
          textSet.fontFamily
        }`;
        ctx.fillStyle = textSet.color;
        ctx.globalAlpha = textSet.opacity;
        ctx.textAlign = textSet.textAlign || "center";
        ctx.textBaseline = "middle";

        const x = (canvas.width / 100) * (textSet.left + 50);
        const y = (canvas.height / 100) * (50 - textSet.top);

        ctx.translate(x, y);
        ctx.rotate((textSet.rotation * Math.PI) / 180);

        const lines = textSet.text.split("\n");
        const lineHeight = textSet.fontSize * scaleFactor * 1.2;
        const startY = (-(lines.length - 1) * lineHeight) / 2;

        lines.forEach((line, index) => {
          ctx.fillText(line, 0, startY + index * lineHeight);
        });

        ctx.restore();
      });

      if (removedBgImageUrl) {
        const removedBgImg = new (window as any).Image();
        removedBgImg.crossOrigin = "anonymous";
        removedBgImg.onload = () => {
          ctx.drawImage(removedBgImg, 0, 0, canvas.width, canvas.height);
        };
        removedBgImg.src = removedBgImageUrl;
      }
    };
    bgImg.src = selectedImage || "";
  };

  const saveCompositeImage = () => {
    renderToCanvas();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "text-behind-image.png";
    link.href = dataUrl;
    link.click();
  };

  useEffect(() => {
    renderToCanvas();
  }, [
    selectedImage,
    isImageSetupDone,
    textSets,
    removedBgImageUrl,
    isAdjusted,
  ]);

  useEffect(() => {
    if (user?.id) {
      getCurrentUser(user.id);
    }
  }, [user]);

  return (
    <>
      {currentUser ? (
        <div className="flex flex-col h-screen">
          <header className="flex flex-row items-center justify-between p-5 px-10">
            <h2 className="text-4xl md:text-2xl font-semibold tracking-tight">
              <span className="block md:hidden">TPC</span>
              <span className="hidden md:block">New Year PopUp Card</span>
            </h2>
            <div className="flex gap-4 items-center">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".jpg, .jpeg, .png"
              />
              <div className="flex items-center gap-5">
                <GenerationCountDisplay
                  paid={currentUser.paid}
                  generationsLeft={2 - currentUser.images_generated}
                  onUpgrade={() => setIsPayDialogOpen(true)}
                  className="hidden md:block"
                />
                <div className="flex gap-2">
                  <ImageActionButton
                    onClick={handleUploadImage}
                    label="Upload image"
                  />
                  {selectedImage && (
                    <ImageActionButton
                      onClick={saveCompositeImage}
                      label="Save image"
                      className="hidden md:flex"
                    />
                  )}
                </div>
              </div>
              <ModeToggle />
            </div>
          </header>
          <Separator />
          {selectedImage ? (
            <div className="flex flex-col md:flex-row items-start justify-start gap-10 w-full h-screen px-10 mt-2">
              <div className="flex flex-col items-start justify-start w-full md:w-1/2 gap-4">
                <canvas
                  ref={canvasRef}
                  style={{
                    width: "100%",
                    maxWidth: "800px",
                    height: "auto",
                    border: "1px solid #ccc",
                    margin: "0 auto",
                  }}
                />
                <div className="flex items-center gap-2">
                  <ImageActionButton
                    onClick={saveCompositeImage}
                    label="Save image"
                    className="md:hidden"
                  />
                  <GenerationCountDisplay
                    paid={currentUser.paid}
                    generationsLeft={2 - currentUser.images_generated}
                    onUpgrade={() => setIsPayDialogOpen(true)}
                    className="block md:hidden"
                  />
                </div>
                <div className="">
                  {!isImageSetupDone && (
                    <span className="flex items-center w-full gap-2">
                      <ReloadIcon className="animate-spin" /> Loading, please
                      wait...
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col w-full md:w-1/2">
                {isImageSetupDone && (
                  <>
                    <ImageActionButton
                      className={
                        isAdjusted
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-600 mb-3"
                          : "mb-3"
                      }
                      onClick={() => {
                        setIsAdjusted(!isAdjusted);
                      }}
                      label={
                        isAdjusted
                          ? "Remove NewYear Filter"
                          : "Add NewYear Filter"
                      }
                    />
                    <Button variant={"secondary"} onClick={addNewTextSet}>
                      <PlusIcon className="mr-2" /> Add New Texts
                    </Button>
                    <ScrollArea className="h-[calc(100vh-10rem)] p-2">
                      <Accordion
                        type="single"
                        collapsible
                        className="w-full mt-2"
                      >
                        {textSets.map((textSet) => (
                          <TextCustomizer
                            key={textSet.id}
                            textSet={textSet}
                            handleAttributeChange={handleAttributeChange}
                            removeTextSet={removeTextSet}
                            duplicateTextSet={duplicateTextSet}
                            userId={currentUser.id}
                          />
                        ))}
                      </Accordion>
                    </ScrollArea>{" "}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 items-center justify-center min-h-screen w-full">
              {/* <Image className="flex" src="/moodang.png" alt="empty" width={300} height={300} /> */}
              <h2 className="flex text-xl font-semibold">
                Uploading Your Photo!
              </h2>
              <ImageActionButton
                className="flex"
                onClick={handleUploadImage}
                label="Upload image"
              />
            </div>
          )}
        </div>
      ) : (
        <Authenticate />
      )}
    </>
  );
};

export default Page;
