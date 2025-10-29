import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CategoryHeaderProps {
    onCreateClick: () => void;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ onCreateClick }) => (
    <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-semibold">Categories</h1>
            <p className="mt-1 text-sm text-gray-600">
                Manage and organize product categories
            </p>
        </div>
        <Button onClick={onCreateClick}>
            <Plus className="mr-2 h-4 w-4" />
            Create Category
        </Button>
    </div>
);

export default CategoryHeader;
