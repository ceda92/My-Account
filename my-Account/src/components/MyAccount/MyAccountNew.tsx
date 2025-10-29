import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useState } from "react";
import Contacts from "./Contacts";
import { ProflieFormContextProvider } from "./FormContext";
import Policies from "./Policies";
import ProfileInfo from "./ProfileInfo";

const MyAccountNew = () => {
  const [activeTab, setActiveTab] = useState("profile-overview");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="h-full w-full"
    >
      <div className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        <TabsList>
          <TabsTrigger value="profile-overview">PROFILE</TabsTrigger>
          <TabsTrigger value="contacts">CONTACTS</TabsTrigger>
          <TabsTrigger value="policies">POLICIES</TabsTrigger>
          <TabsTrigger value="security" disabled>
            SECURITY
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="profile-overview">
        <ProflieFormContextProvider>
          <ProfileInfo />
        </ProflieFormContextProvider>
      </TabsContent>

      <TabsContent value="contacts">
        <div className="mx-auto w-full bg-gray-100 px-4 py-8">
          <Contacts />
        </div>
      </TabsContent>

      <TabsContent value="policies" className="h-full">
        <div className="mx-auto h-full w-full bg-gray-100 px-4 py-8">
          <Policies />
        </div>
      </TabsContent>
      <TabsContent value="security">
        <div className="mx-auto w-full bg-gray-100 px-4 py-8">SECURITY</div>
      </TabsContent>
    </Tabs>
  );
};

export default MyAccountNew;
