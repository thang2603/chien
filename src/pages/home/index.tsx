import { useQuery } from "@tanstack/react-query";
import { getAllLayout } from "../../services/layout";
import { Box, Button, Card, Inset, Strong, Text } from "@radix-ui/themes";

import AddDialog from "./components/AddDialog";
import { useNavigate } from "react-router-dom";
import Loading from "../../component/loading";

const Home = () => {
  const navigate = useNavigate();
  const { data, isFetching } = useQuery({
    queryKey: ["all-layout"],
    queryFn: () => getAllLayout(),
    select: (d) => {
      return d?.data;
    },
  });

  const handleNavigate = (id: string) => {
    navigate(`/layout/detail/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/layout/${id}`);
  };

  return (
    <div>
      {isFetching ? (
        <Loading />
      ) : (
        <div className="flex flex-wrap gap-4 px-5 py-6">
          {data?.map((item: any) => (
            <Box width="280px" className="cursor-pointer" key={item.id}>
              <Card size="2">
                <Inset
                  clip="padding-box"
                  side="top"
                  pb="current"
                  onClick={() => handleNavigate(item?.id)}
                >
                  <img
                    src="https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                    alt="Bold typography"
                    style={{
                      display: "block",
                      objectFit: "cover",
                      width: "100%",
                      height: 140,
                      backgroundColor: "var(--gray-5)",
                    }}
                  />
                </Inset>
                <div className="flex items-center justify-between">
                  <Text as="p" size="3">
                    <Strong>{item.name}</Strong>
                  </Text>
                  <div className="flex items-center gap-1">
                    <Button
                      className="cursor-pointer!"
                      onClick={() => handleEdit(item?.id)}
                    >
                      Sửa
                    </Button>
                    <Button className="cursor-pointer!">Xóa</Button>
                  </div>
                </div>
              </Card>
            </Box>
          ))}
          <Box maxWidth="240px">
            <Card size="2">
              <AddDialog />
            </Card>
          </Box>
        </div>
      )}
    </div>
  );
};

export default Home;
