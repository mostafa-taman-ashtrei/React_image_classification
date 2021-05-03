import React, { useRef, useState, useEffect } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs-backend-webgl';
import {
    Box, Image, Button, Center, Heading, Input, Flex, Spacer,
    Table, Tr, Thead, TableCaption, Th, Tbody, Td,
} from '@chakra-ui/react';

const version = 2;
const alpha = 0.5;

const Home: React.FC = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isModelLoading, setIsModelLoading] = useState<boolean>(false);
    const [loadedModel, setLoadedModel] = useState<mobilenet.MobileNet | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [predictions, setPreictions] = useState<{ className: string; probability: number; }[] | null>(null);

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
            console.log(e.target.files[0].type);
            setPreictions(null);
            const reader: FileReader = new FileReader();
            reader.onload = async () => setImageUrl(reader.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const classify = async () => {
        const results = await loadedModel!.classify(imageRef.current!);
        console.log(results);
        setPreictions(results);
    };

    if (isModelLoading) return <h2 style={{ textAlign: 'center' }}>Loading model</h2>;

    return (
        <Box w="100" maxW={{ base: 'xl', md: '7xl' }} mx="auto" px={{ md: '8' }} textAlign="center">
            <Heading m="4">MobileNet image prediction!</Heading>
            <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                size="md"
                width="md"
                m="4"
            />

            { imageUrl != null
                ? (
                    <Flex>
                        <Box p="4">
                            <Center>
                                <Image
                                    src={imageUrl}
                                    crossOrigin="anonymous"
                                    alt="image to be classified"
                                    ref={imageRef}
                                    width="lg"
                                    height="lg"
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

                                <TableCaption fontSize="md" placement="top">Image Prediction Results</TableCaption>

                                <Tbody>
                                    {
                                        predictions != null
                                            ? predictions.map((p) => (
                                                <Tr>
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
                    </Flex>
                )
                : null}
        </Box>
    );
};

export default Home;
