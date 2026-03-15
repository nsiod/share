import { Copy, Info, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Button,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { sliceAddress } from '@/lib/help'

import type { PublicKey } from '@/types'

interface PublicKeyTableProps {
  publicKeys: PublicKey[]
  onCopy: (address: string) => void
  onEditNote: (key: PublicKey, index: number) => void
  onDelete: (index: number) => void
  onSaveNote: (index: number, note: string) => void
}

export const PublicKeyTable = ({
  publicKeys,
  onCopy,
  onDelete,
  onSaveNote,
}: PublicKeyTableProps) => {
  const { t } = useTranslation()
  const [isNotePopoverOpen, setIsNotePopoverOpen] = useState(false)
  const [isDeletePopoverOpen, setIsDeletePopoverOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingNote, setEditingNote] = useState('')

  const handleEditNote = (key: PublicKey, index: number) => {
    setEditingIndex(index)
    setEditingNote(key.note || '')
    setIsNotePopoverOpen(true)
  }

  const handleSaveNote = () => {
    if (editingIndex !== null) {
      onSaveNote(editingIndex, editingNote)
      setIsNotePopoverOpen(false)
      setEditingIndex(null)
      setEditingNote('')
    }
  }

  const handleCancelNote = () => {
    setIsNotePopoverOpen(false)
    setEditingIndex(null)
    setEditingNote('')
  }

  const handleDeleteClick = (index: number) => {
    setEditingIndex(index)
    setIsDeletePopoverOpen(true)
  }

  const handleConfirmDelete = () => {
    if (editingIndex !== null) {
      onDelete(editingIndex)
      setIsDeletePopoverOpen(false)
      setEditingIndex(null)
    }
  }

  const handleCancelDelete = () => {
    setIsDeletePopoverOpen(false)
    setEditingIndex(null)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-xs">
            {t('settings.externalKeys.publicKey')}
          </TableHead>
          <TableHead className="text-xs">
            {t('settings.externalKeys.note')}
          </TableHead>
          <TableHead className="text-xs text-right">
            {t('settings.externalKeys.actions')}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {publicKeys.map((key, index) => (
          <TableRow key={key.publicKey}>
            {/* Public Key */}
            <TableCell>
              <div className="flex items-center gap-1">
                <span className="text-xs font-mono text-gray-700 dark:text-gray-300">
                  {sliceAddress(key.publicKey, 6, 6)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 flex-shrink-0"
                  onClick={() => onCopy(key.publicKey)}
                >
                  <Copy className="size-3" />
                </Button>
              </div>
            </TableCell>

            {/* Note */}
            <TableCell>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 dark:text-gray-400 max-w-[120px] truncate">
                  {key.note || '---'}
                </span>
                <Popover
                  open={isNotePopoverOpen && editingIndex === index}
                  onOpenChange={(open) => !open && handleCancelNote()}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 flex-shrink-0"
                      onClick={() => handleEditNote(key, index)}
                    >
                      <Pencil className="size-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        {t('settings.editNote')}
                      </Label>
                      <Input
                        type="text"
                        value={editingNote}
                        onChange={(e) => setEditingNote(e.target.value)}
                        className="w-full text-sm"
                        placeholder={t('settings.externalKeys.notePlaceholder')}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelNote}
                        >
                          {t('settings.cancel')}
                        </Button>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={handleSaveNote}
                        >
                          {t('settings.save')}
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </TableCell>

            {/* Actions */}
            <TableCell className="text-right">
              <Popover
                open={isDeletePopoverOpen && editingIndex === index}
                onOpenChange={(open) => !open && handleCancelDelete()}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteClick(index)}
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                        <Info className="size-3 text-red-600 dark:text-red-400" />
                      </div>
                      <h4 className="text-sm font-semibold">
                        {t('settings.externalKeys.deleteTitle')}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {t('settings.externalKeys.deleteConfirm')}
                    </p>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelDelete}
                      >
                        {t('settings.cancel')}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleConfirmDelete}
                      >
                        {t('settings.delete')}
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
