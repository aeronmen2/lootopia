'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useToast from '@/hooks/useToast';
import { Artefact, artefactSchema } from '@/lib/types';
import { artefactApi } from '@/api/artefact';

export default function ArtifactForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<Artefact>({
    defaultValues: {
      name: '',
      description: '',
      rarity: 'common',
      image: undefined,
    },
  });

  async function createArtefact(data: Artefact) {
    const validatedData = artefactSchema.parse(data);
    // Pass the file to the API
    await artefactApi.create({
      ...validatedData,
      file: data.image as File, // image is the File from the form
    });

    return { success: true, data: validatedData };
  }

  // Fonction pour gérer la prévisualisation de l'image
  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  async function onSubmit(data: Artefact) {
    try {
      // Appel à l'action serveur pour créer l'artefact
      const result = await createArtefact(data);

      if (result.success) {
        toast.success({
          title: 'Succès !',
          message: 'Artefact créé avec succès !',
          autoClose: 3000,
          position: 'top-right',
        });
        form.reset();
        setImagePreview(null);
      }
    } catch {
      toast.error({
        title: 'Erreur',
        message: "Une erreur est survenue lors de la création de l'artefact.",
        autoClose: 3000,
        position: 'top-right',
      });
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Nom de l'artefact" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description de l'artefact"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rarity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rareté</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={
                        field.value === 'legendary'
                          ? 'text-amber-500 font-semibold'
                          : field.value === 'epic'
                            ? 'text-purple-500 font-semibold'
                            : field.value === 'rare'
                              ? 'text-blue-500 font-semibold'
                              : 'text-gray-500'
                      }
                    >
                      <SelectValue placeholder="Sélectionnez la rareté" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="common" className="text-gray-500">
                      Commun
                    </SelectItem>
                    <SelectItem
                      value="rare"
                      className="text-blue-500 font-semibold"
                    >
                      Rare
                    </SelectItem>
                    <SelectItem
                      value="epic"
                      className="text-purple-500 font-semibold"
                    >
                      Épique
                    </SelectItem>
                    <SelectItem
                      value="legendary"
                      className="text-amber-500 font-semibold"
                    >
                      Légendaire
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field: { onChange } }) => (
              <FormItem>
                <FormLabel>Image de l'artefact</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        onChange(file);
                        handleImageChange(file);
                      }}
                      // Do not spread fieldProps to avoid passing value to file input
                      name="image"
                    />
                    {imagePreview && (
                      <div className="mt-2 border rounded-md overflow-hidden w-full max-w-[300px]">
                        <img
                          src={imagePreview || '/placeholder.svg'}
                          alt="Prévisualisation"
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Sélectionnez une image pour représenter l'artefact
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Créer l'artefact
          </Button>
        </form>
      </Form>
    </div>
  );
}
