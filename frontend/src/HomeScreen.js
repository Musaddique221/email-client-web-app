import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Heading,
  Box,
  Text,
  Flex,
  Grid,
  Button,
  IconButton,
  CloseButton,
} from "@chakra-ui/react";
import moment from "moment";

import { useSelector, useDispatch } from "react-redux";
import { filter } from "./redux/slices/FilterSlice";
import { setList } from "./redux/slices/ListSlice";
import { filterList } from "./utils/filterList";

const HomeScreen = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [singleData, setSingleData] = useState([]);
  const [subject, setSubject] = useState([]);

  const { filters } = useSelector((state) => state.filters);
  const { emailList } = useSelector((state) => state.emailList);

  const dispatch = useDispatch();

  const getAllData = async () => {
    try {
      const { data } = await axios.get("https://flipkart-email-mock.now.sh/");
      const updatedData = data.list.map((obj) => {
        return { ...obj, read: false, favorite: false };
      });
      dispatch(setList(updatedData));
      setData(updatedData);
    } catch (err) {
      return err.message;
    }
  };

  useEffect(() => {
    const filteredList = filterList(emailList, filters);
    setData(filteredList);
  }, [filters, emailList]);

  useEffect(() => {
    getAllData();
  }, []);

  const clickHandler = async (id) => {
    try {
      const { data } = await axios.get(
        `https://flipkart-email-mock.vercel.app/?id=${id}`
      );
      setSingleData(data);

      setShow(true);
    } catch (err) {
      return err.message;
    }

    const items = data.filter((obj) => {
      if (obj.id === id) {
        return [obj.subject, obj.date, obj.from];
      }
    });

    const sub = items.map((obj) => {
      return [obj.subject, obj.date, obj.from];
    });
    setSubject(sub);

    // handle read
    const updatedData = emailList.map((email) =>
      email.id === id ? { ...email, read: true } : email
    );
    dispatch(setList(updatedData));
    setData(updatedData);
  };

  const readHandler = async () => {
    dispatch(filter("read"));
  };
  const unreadHandler = () => {
    dispatch(filter("unread"));
  };

  const favoriteHandler = () => {
    dispatch(filter("favorite"));
  };

  const addToFavorites = (id) => {
    const updatedData = emailList.map((email) =>
      email.id === id ? { ...email, favorite: true } : email
    );
    dispatch(setList(updatedData));
    setData(updatedData);
  };
  return (
    <>
      <Grid
        templateColumns={show ? "1fr 1.5fr" : "auto"}
        gap="10"
        textColor="#636363"
        bgColor="#F4F5F9"
      >
        <Box _hover={{ cursor: "pointer" }}>
          <Flex flexDirection="row" gap="5" ml="20" mt="10" mb="10">
            <Text mt="12" marginLeft={show ? "0%" : "6%"} fontWeight="medium">
              Filter By:
            </Text>
            <Button
              mt="10"
              colorScheme="red"
              variant={filters.includes("read") ? "solid" : "outline"}
              onClick={readHandler}
            >
              Read
            </Button>
            <Button
              mt="10"
              colorScheme="red"
              variant={filters.includes("unread") ? "solid" : "outline"}
              onClick={unreadHandler}
            >
              Unread
            </Button>
            <Button
              mt="10"
              colorScheme="red"
              variant={filters.includes("favorite") ? "solid" : "outline"}
              onClick={favoriteHandler}
            >
              Favorite
            </Button>
          </Flex>
          {data.map((obj) => (
            <>
              <Flex justifyContent="center">
                <Flex
                  shadow="lg"
                  w="80%"
                  p="6"
                  mt="5"
                  flexDirection="row"
                  borderRadius="10"
                  onClick={() => clickHandler(obj.id)}
                  bgColor={obj.read ? "#F2F2F2" : "#F4F5F9"}
                >
                  <Box h="50px" w="50px">
                    <Text
                      alignItems="center"
                      textAlign="center"
                      borderRadius="50%"
                      bgColor="#E54065"
                      color="white"
                      fontSize="3xl"
                      fontWeight="bold"
                    >
                      {obj.from.name[0].toUpperCase()}
                    </Text>
                  </Box>
                  <Flex
                    flexDirection="column"
                    ml="10"
                    bgColor={obj.read ? "#F2F2F2" : "#F4F5F9"}
                    textDecor={obj.read ? "#F2F2F2" : "#F4F5F9"}
                  >
                    <Text>
                      From: <strong>{obj.from.email}</strong>
                    </Text>
                    <Text>
                      Subject: <strong>{obj.subject}</strong>
                    </Text>
                    <Text mt="1">{obj.short_description}</Text>
                    <Text>{moment(obj.date).format("dd/MM/yyyy hh:mm a")}</Text>
                    {obj.favorite && (
                      <>
                        <Text color="red" ml="auto" mt="2">
                          Favorite
                        </Text>
                      </>
                    )}
                  </Flex>
                </Flex>
              </Flex>
            </>
          ))}
        </Box>
        {show && (
          <Flex mt="20%" textColor="#636363">
            <Box
              shadow="lg"
              h="min-content"
              mr="10"
              borderRadius="10"
              style={{
                position: "sticky",
                top: 0,
              }}
            >
              <IconButton
                variant="ghost"
                colorScheme="red"
                aria-label="Call Sage"
                fontSize="5px"
                padding={1}
                icon={<CloseButton />}
                onClick={() => setShow(false)}
              />
              <Flex flexDirection="row" mt="10" justifyContent="space-evenly">
                <Box h="12" w="12">
                  <Text
                    mt="1.5"
                    mb="10"
                    textAlign="center"
                    borderRadius="50%"
                    bgColor="#E54065"
                    color="white"
                    fontSize="x-large"
                    fontWeight="bold"
                    ml="3"
                  >
                    {subject[0][2].name[0].toUpperCase()}
                  </Text>
                </Box>

                <Heading as="h1" mr="auto" ml="5">
                  {subject[0][0]}
                </Heading>
                <Button
                  bgColor="#E54065"
                  borderRadius="10"
                  color="white"
                  mr="5"
                  onClick={() => addToFavorites(singleData.id)}
                >
                  Add to favorites
                </Button>
              </Flex>
              <Text ml="10" mt="5">
                {moment(subject[0][1]).format("dd/MM/yyyy hh:mm a")}
              </Text>
              <Box m="10">{singleData.body}</Box>
            </Box>
          </Flex>
        )}
      </Grid>
    </>
  );
};

export default HomeScreen;
