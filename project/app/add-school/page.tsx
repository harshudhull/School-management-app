'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { toast } from 'sonner';
import { schoolStorage } from '@/lib/storage';

import { Loader2, School, ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ✅ Schema validation with zod
const schoolSchema = z.object({
  name: z.string().min(2, 'School name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  contact: z
    .string()
    .regex(/^[0-9]{10}$/, 'Contact must be a valid 10-digit number'),
  email_id: z.string().email('Please enter a valid email address'),
  image: z
    .union([z.string().url('Please enter a valid image URL'), z.literal('')])
    .optional(),
});

type SchoolFormData = z.infer<typeof schoolSchema>;

export default function AddSchool() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      image: '',
    },
  });

  const imageUrl = watch('image');

  const onSubmit = async (data: SchoolFormData) => {
    setIsSubmitting(true);

    try {
      // Fake delay for UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store school
      schoolStorage.addSchool(data);

      toast.success('School added successfully!');
      reset();

      // Redirect after success
      setTimeout(() => {
        router.push('/show-schools');
      }, 1500);
    } catch (error) {
      console.error('Error adding school:', error);
      toast.error('Failed to add school. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // ✅ You’d normally upload to S3/Cloudinary etc.
      const placeholderUrl =
        'https://images.pexels.com/photos/289740/pexels-photo-289740.jpeg?auto=compress&cs=tinysrgb&w=800';

      setValue('image', placeholderUrl, { shouldValidate: true });
      toast.success('Image uploaded successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/show-schools"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Schools
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <School className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Add New School</h1>
          </div>
          <p className="text-gray-600">Register a new school in our directory</p>
        </div>

        {/* Form Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-2 pb-6">
              <CardTitle className="text-2xl text-center">
                School Information
              </CardTitle>
              <CardDescription className="text-center">
                Fill in all the details to register a new school
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">School Name *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Enter school name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    {...register('address')}
                    placeholder="Enter complete address"
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                {/* City / State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      {...register('city')}
                      placeholder="Enter city"
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      {...register('state')}
                      placeholder="Enter state"
                    />
                    {errors.state && (
                      <p className="text-sm text-red-500">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact / Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Number *</Label>
                    <Input
                      id="contact"
                      {...register('contact')}
                      placeholder="Enter 10-digit number"
                    />
                    {errors.contact && (
                      <p className="text-sm text-red-500">
                        {errors.contact.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email_id">Email Address *</Label>
                    <Input
                      id="email_id"
                      type="email"
                      {...register('email_id')}
                      placeholder="Enter email address"
                    />
                    {errors.email_id && (
                      <p className="text-sm text-red-500">
                        {errors.email_id.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                  <Label>School Image</Label>
                  <Input
                    {...register('image')}
                    placeholder="Enter image URL or upload below"
                  />
                  {errors.image && (
                    <p className="text-sm text-red-500">{errors.image.message}</p>
                  )}

                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to upload an image
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </label>
                  </div>

                  {imageUrl && (
                    <div className="mt-4">
                      <Label className="block mb-2">Image Preview</Label>
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={imageUrl}
                          alt="School preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding School...
                    </>
                  ) : (
                    'Add School'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
