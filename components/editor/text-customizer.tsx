import React, { useState } from 'react';
import InputField from './input-field';
import SliderField from './slider-field';
import ColorPicker from './color-picker';
import FontFamilyPicker from './font-picker'; 
import { Button } from '../ui/button';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Move, Text, Bold, RotateCw, Palette, LightbulbIcon, CaseSensitive, TypeOutline, Trash2, Copy } from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TextCustomizerProps {
    textSet: {
        id: number;
        text: string;
        fontFamily: string;
        top: number;
        left: number;
        color: string;
        fontSize: number;
        fontWeight: number;
        opacity: number;
        rotation: number;
        shadowColor: string;
        shadowSize: number;
        textAlign: string;
    };
    handleAttributeChange: (id: number, attribute: string, value: any) => void;
    removeTextSet: (id: number) => void;
    duplicateTextSet: (textSet: any) => void;
    userId: string;
}

const TextCustomizer: React.FC<TextCustomizerProps> = ({ textSet, handleAttributeChange, removeTextSet, duplicateTextSet, userId }) => {
    const [activeControl, setActiveControl] = useState<string | null>(null);

    const controls = [
        { id: 'text', icon: <CaseSensitive size={20} />, label: 'Text' },
        { id: 'fontFamily', icon: <TypeOutline size={20} />, label: 'Font' },
        { id: 'color', icon: <Palette size={20} />, label: 'Color' },
        { id: 'position', icon: <Move size={20} />, label: 'Position' },
        { id: 'fontSize', icon: <Text size={20} />, label: 'Size' },
        { id: 'fontWeight', icon: <Bold size={20} />, label: 'Weight' },
        { id: 'opacity', icon: <LightbulbIcon size={20} />, label: 'Opacity' },
        { id: 'rotation', icon: <RotateCw size={20} />, label: 'Rotate' },
    ];

    return (
        <AccordionItem value={`item-${textSet.id}`}>
            <AccordionTrigger>{textSet.text}</AccordionTrigger>
            <AccordionContent>
                {/* Mobile Controls */}
                <div className="md:hidden">
                    <Tabs defaultValue="text" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 gap-1 mb-2">
                            {controls.map((control) => (
                                <TabsTrigger 
                                    key={control.id} 
                                    value={control.id}
                                    className="flex flex-col items-center justify-center h-[4.2rem] gap-1"
                                >
                                    {control.icon}
                                    <span className="text-xs">{control.label}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <TabsContent value="text">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Text Content</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <InputField
                                        attribute="textarea"
                                        label="Text"
                                        currentValue={textSet.text}
                                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="fontFamily">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Font Settings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FontFamilyPicker
                                        attribute="fontFamily"
                                        currentFont={textSet.fontFamily}
                                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                        userId={userId}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="color">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Color Settings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ColorPicker
                                        attribute="color"
                                        label="Text Color"
                                        currentColor={textSet.color}
                                        handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="position">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Position Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <SliderField
                                            attribute="left"
                                            label="X Position"
                                            min={-200}
                                            max={200}
                                            step={1}
                                            currentValue={textSet.left}
                                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                        />
                                    </div>
                                    <div>
                                        <SliderField
                                            attribute="top"
                                            label="Y Position"
                                            min={-100}
                                            max={100}
                                            step={1}
                                            currentValue={textSet.top}
                                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="fontSize">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Size Settings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <SliderField
                                            attribute="fontSize"
                                            label="Text Size"
                                            min={10}
                                            max={800}
                                            step={1}
                                            currentValue={textSet.fontSize}
                                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="fontWeight">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Weight Settings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <SliderField
                                            attribute="fontWeight"
                                            label="Font Weight"
                                            min={100}
                                            max={900}
                                            step={100}
                                            currentValue={textSet.fontWeight}
                                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="opacity">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Opacity Settings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <SliderField
                                            attribute="opacity"
                                            label="Text Opacity"
                                            min={0}
                                            max={1}
                                            step={0.01}
                                            currentValue={textSet.opacity}
                                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="rotation">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Rotation Settings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div>
                                        <SliderField
                                            attribute="rotation"
                                            label="Rotation"
                                            min={-360}
                                            max={360}
                                            step={1}
                                            currentValue={textSet.rotation}
                                            handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:block space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Text Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <InputField
                                attribute="text"
                                label="Text"
                                currentValue={textSet.text}
                                handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                            />
                            <FontFamilyPicker
                                attribute="fontFamily"
                                currentFont={textSet.fontFamily}
                                handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                userId={userId}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ColorPicker
                                attribute="color"
                                label="Text Color"
                                currentColor={textSet.color}
                                handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                            />
                            <div>
                                <SliderField
                                    attribute="fontSize"
                                    label="Text Size"
                                    min={10}
                                    max={800}
                                    step={1}
                                    currentValue={textSet.fontSize}
                                    handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                />
                            </div>
                            <div>
                                <SliderField
                                    attribute="fontWeight"
                                    label="Font Weight"
                                    min={100}
                                    max={900}
                                    step={100}
                                    currentValue={textSet.fontWeight}
                                    handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                />
                            </div>
                            <div>
                                <SliderField
                                    attribute="opacity"
                                    label="Text Opacity"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    currentValue={textSet.opacity}
                                    handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Position & Rotation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>

                                <SliderField
                                    attribute="left"
                                    label="X Position"
                                    min={-200}
                                    max={200}
                                    step={1}
                                    currentValue={textSet.left}
                                    handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                />
                            </div>
                            <div>

                                <SliderField
                                    attribute="top"
                                    label="Y Position"
                                    min={-100}
                                    max={100}
                                    step={1}
                                    currentValue={textSet.top}
                                    handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                />
                            </div>
                            <div>
                                
                                <SliderField
                                    attribute="rotation"
                                    label="Rotation"
                                    min={-360}
                                    max={360}
                                    step={1}
                                    currentValue={textSet.rotation}
                                    handleAttributeChange={(attribute, value) => handleAttributeChange(textSet.id, attribute, value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Text Alignment</Label>
                                <div className="flex gap-2">
                                    <Button
                                        variant={textSet.textAlign === 'left' ? 'default' : 'secondary'}
                                        onClick={() => handleAttributeChange(textSet.id, 'textAlign', 'left')}
                                    >
                                        Left
                                    </Button>
                                    <Button
                                        variant={textSet.textAlign === 'center' ? 'default' : 'secondary'}
                                        onClick={() => handleAttributeChange(textSet.id, 'textAlign', 'center')}
                                    >
                                        Center
                                    </Button>
                                    <Button
                                        variant={textSet.textAlign === 'right' ? 'default' : 'secondary'}
                                        onClick={() => handleAttributeChange(textSet.id, 'textAlign', 'right')}
                                    >
                                        Right
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-row gap-2 my-8">
                    <Button onClick={() => duplicateTextSet(textSet)}>
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Duplicate Text Set</span>
                    </Button>
                    <Button onClick={() => removeTextSet(textSet.id)} variant="destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove Text Set</span>
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};

export default TextCustomizer;
