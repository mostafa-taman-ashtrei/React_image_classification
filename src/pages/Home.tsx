import React, { useRef, useState, useEffect } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs-backend-webgl';
import {
    Box, Image, Button, Center, Heading, Input, Spacer,
    Table, Tr, Thead, TableCaption, Th, Tbody, Td, Wrap, Progress,
} from '@chakra-ui/react';

import generateKey from '../utils/generateKey';

const version = 2;
const alpha = 0.5;

const Home: React.FC = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isModelLoading, setIsModelLoading] = useState<boolean>(false);
    const [loadedModel, setLoadedModel] = useState<mobilenet.MobileNet | null>(null);
    const [predictions, setPreictions] = useState<{ className: string; probability: number; }[] | null>(null);
    const [fileName, setFileName] = useState<String>('');
    const imageRef = useRef<HTMLImageElement>(null);

    const loadModel = async () => {
        setIsModelLoading(true);
        try {
            const model = await mobilenet.load({ version, alpha });
            setLoadedModel(model);
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
        setIsModelLoading(false);
    };

    useEffect(() => { loadModel(); }, []);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPreictions(null);
            const reader: FileReader = new FileReader();
            reader.onload = async () => setImageUrl(reader.result as string);
            reader.readAsDataURL(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }
    };

    const classify = async () => {
        const results = await loadedModel!.classify(imageRef.current!);
        setPreictions(results);
    };

    if (isModelLoading) return <Progress size="xs" isIndeterminate />;

    return (
        <Box w="100" mx="auto" px={{ md: '8' }} textAlign="center">
            <Heading m="4">MobileNet Img Classification!</Heading>
            <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                size="md"
                width="sm"
                m="2"
            />

            {imageUrl != null
                ? (
                    <Wrap spacing="40px" py="2" mx="9">
                        <Box p="4">
                            <Center>
                                <Image
                                    src={imageUrl}
                                    crossOrigin="anonymous"
                                    alt="image to be classified"
                                    ref={imageRef}
                                    width="lg"
                                    height="sm"
                                    m="4"
                                />
                            </Center>

                            <Button
                                type="button"
                                onClick={classify}
                                size="md"
                                height="48px"
                                width="200px"
                                border="2px"
                                borderColor="green.500"
                            >
                                Classify
                            </Button>
                        </Box>

                        <Spacer />

                        <Box p="4">
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Class</Th>
                                        <Th>Percentage</Th>
                                    </Tr>
                                </Thead>

                                <TableCaption fontSize="md" placement="top">
                                    {fileName}
                                    {' '}
                                    Prediction Results
                                </TableCaption>

                                <Tbody>
                                    {
                                        predictions != null
                                            ? predictions.map((p) => (
                                                <Tr key={generateKey(6)}>
                                                    <Td>{p.className}</Td>
                                                    <Td>
                                                        {(p.probability * 100).toFixed(3)}
                                                        {' '}
                                                        %
                                                    </Td>
                                                </Tr>

                                            ))
                                            : null
                                    }
                                </Tbody>
                            </Table>
                        </Box>
                    </Wrap>
                )
                : null}
        </Box>
    );
};

export default Home;
