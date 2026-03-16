import { Copy, Download, Info, Link, Pencil, Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'
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

import type { KeyPair } from '@/types'

interface KeyPairTableProps {
  keyPairs: KeyPair[]
  onCopyPublic: (publicKey: string) => void
  onCopyMnemonic: (mnemonic: string) => void
  onEditNote: (keyPair: KeyPair, index: number) => void
  onDelete: (index: number) => void
  onSaveNote: (index: number, note: string) => void
}

export const KeyPairTable = ({
  keyPairs,
  onCopyPublic,
  onCopyMnemonic,
  onDelete,
  onSaveNote,
}: KeyPairTableProps) => {
  const { t } = useTranslation()
  const [isNotePopoverOpen, setIsNotePopoverOpen] = useState(false)
  const [isDeletePopoverOpen, setIsDeletePopoverOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingNote, setEditingNote] = useState('')

  const handleEditNote = (keyPair: KeyPair, index: number) => {
    setEditingIndex(index)
    setEditingNote(keyPair.note || '')
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

  const handleLink = (publicKey: string) => {
    const link = `${window.location.href}#/pub/${publicKey}`
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  const handleDownloadMnemonic = useCallback((mnemonic: string) => {
    if (mnemonic) {
      const blob = new Blob([mnemonic], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'mnemonic.txt'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }, [])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-xs">
            {t('settings.keys.publicKey')}
          </TableHead>
          <TableHead className="text-xs">
            {t('settings.keys.mnemonic')}
          </TableHead>
          <TableHead className="text-xs">{t('settings.keys.note')}</TableHead>
          <TableHead className="text-xs text-right">
            {t('settings.keys.actions')}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {keyPairs.map((keyPair, index) => (
          <TableRow key={keyPair.publicKey}>
            {/* Public Key */}
            <TableCell>
              <div className="flex items-center gap-1">
                <span className="text-xs font-mono text-gray-700 dark:text-gray-300">
                  {sliceAddress(keyPair.publicKey, 6, 6)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 flex-shrink-0"
                  onClick={() => onCopyPublic(keyPair.publicKey)}
                >
                  <Copy className="size-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 flex-shrink-0"
                  onClick={() => handleLink(keyPair.publicKey)}
                >
                  <Link className="size-3" />
                </Button>
              </div>
            </TableCell>

            {/* Mnemonic */}
            <TableCell>
              {keyPair.mnemonic ? (
                <div className="flex items-center gap-1">
                  <span className="text-xs font-mono text-gray-700 dark:text-gray-300">
                    {keyPair.mnemonic.split(' ').slice(0, 3).join(' ')}...
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 flex-shrink-0"
                    onClick={() => onCopyMnemonic(keyPair.mnemonic!)}
                  >
                    <Copy className="size-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 flex-shrink-0"
                    onClick={() => handleDownloadMnemonic(keyPair.mnemonic!)}
                  >
                    <Download className="size-3" />
                  </Button>
                </div>
              ) : (
                <span className="text-xs text-gray-400">---</span>
              )}
            </TableCell>

            {/* Note */}
            <TableCell>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 dark:text-gray-400 max-w-[100px] truncate">
                  {keyPair.note || '---'}
                </span>
                <Popover
                  open={isNotePopoverOpen && editingIndex === index}
                  onOpenChange={(open) => !open && handleCancelNote()}
                >
                  <PopoverTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 flex-shrink-0"
                        onClick={() => handleEditNote(keyPair, index)}
                      />
                    }
                  >
                    <Pencil className="size-3" />
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
                        placeholder={t('settings.keys.notePlaceholder')}
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
                          {t('settings.confirm')}
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
                <PopoverTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteClick(index)}
                    />
                  }
                >
                  <Trash2 className="size-3" />
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                        <Info className="size-3 text-red-600 dark:text-red-400" />
                      </div>
                      <h4 className="text-sm font-semibold">
                        {t('settings.keys.deleteTitle')}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {t('settings.keys.deleteConfirm')}
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
