"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BacOptionsTable from "@/components/ParametersComp/BacOptionsTable";
import CitiesTable from "@/components/ParametersComp/CitiesTable";
import FilieresTable from "@/components/ParametersComp/FilieresTable";

export default function ParametersPage() {
  return (
    <div className="container p-6 mx-auto">
      <h1 className="text-2xl font-bold mb-6">Paramètres du Système</h1>
      
      <Tabs defaultValue="bacOptions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bacOptions">Options du Bac</TabsTrigger>
          <TabsTrigger value="cities">Villes</TabsTrigger>
          <TabsTrigger value="filieres">Filières</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bacOptions">
          <Card className="p-6">
            <BacOptionsTable />
          </Card>
        </TabsContent>
        
        <TabsContent value="cities">
          <Card className="p-6">
            <CitiesTable />
          </Card>
        </TabsContent>
        
        <TabsContent value="filieres">
          <Card className="p-6">
            <FilieresTable />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 