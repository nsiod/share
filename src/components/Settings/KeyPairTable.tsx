import { Copy, Download, Eye, Info, Link, Pencil, Trash2 } from 'lucide-react'
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui'
import { sliceAddress } from '@/lib/help'

import type { KeyPair } from '@/types'

interface KeyPairTableProps {
  keyPairs: KeyPair[]
  onCopyPublic: (publicKey: string) => void
  onCopyMnemonic: (mnemonic: string) => void
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
  const [mnemonicOpenIndex, setMnemonicOpenIndex] = useState<number | null>(
    null,
  )
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
    const link = `${window.location.origin}${window.location.pathname}#/pub/${publicKey}`
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
      setMnemonicOpenIndex(null)
    }
  }, [])

  const handleCopyMnemonicInPopover = useCallback(
    (mnemonic: string) => {
      onCopyMnemonic(mnemonic)
      setMnemonicOpenIndex(null)
    },
    [onCopyMnemonic],
  )

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-xs">
            {t('settings.keys.publicKey')}
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
              <Tooltip>
                <TooltipTrigger
                  render={
                    <span className="text-xs font-mono text-gray-700 dark:text-gray-300 cursor-default" />
                  }
                >
                  {sliceAddress(keyPair.publicKey, 10, 6)}
                </TooltipTrigger>
                <TooltipContent className="max-w-[90vw]">
                  <span className="font-mono break-all select-all">
                    {keyPair.publicKey}
                  </span>
                </TooltipContent>
              </Tooltip>
            </TableCell>

            {/* Note */}
            <TableCell>
              <span className="text-xs text-gray-500 dark:text-gray-400 max-w-[100px] truncate">
                {keyPair.note || '---'}
              </span>
            </TableCell>

            {/* Actions */}
            <TableCell>
              <div className="flex items-center justify-end gap-0.5">
                {/* Copy public key */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  aria-label={t('settings.keys.publicKeyCopied')}
                  onClick={() => onCopyPublic(keyPair.publicKey)}
                >
                  <Copy className="size-3.5" />
                </Button>

                {/* Share link */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  aria-label="Share link"
                  onClick={() => handleLink(keyPair.publicKey)}
                >
                  <Link className="size-3.5" />
                </Button>

                {/* View mnemonic */}
                {keyPair.mnemonic && (
                  <Popover
                    open={mnemonicOpenIndex === index}
                    onOpenChange={(open) =>
                      setMnemonicOpenIndex(open ? index : null)
                    }
                  >
                    <PopoverTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          aria-label={t('settings.keys.viewMnemonic')}
                        />
                      }
                    >
                      <Eye className="size-3.5" />
                    </PopoverTrigger>
                    <PopoverContent className="w-80 sm:w-96">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Eye className="size-4 text-gray-600 dark:text-gray-400" />
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {t('settings.keys.viewMnemonic')}
                          </h4>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {keyPair.mnemonic.split(' ').map((word, i) => (
                            <div
                              key={`${word}-${i}`}
                              className="flex items-center gap-1.5 px-2 py-1.5 rounded border border-gray-200 dark:border-gray-600 text-sm"
                            >
                              <span className="text-gray-400 text-xs">
                                {i + 1}
                              </span>
                              <span className="text-gray-900 dark:text-gray-100">
                                {word}
                              </span>
                            </div>
                          ))}
                        </div>
                        <p className="flex items-center gap-1 text-xs text-orange-500">
                          <Info className="size-3" />
                          {t('settings.keys.mnemonicWarning')}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() =>
                              handleCopyMnemonicInPopover(keyPair.mnemonic!)
                            }
                          >
                            <Copy className="size-4 mr-1" />
                            {t('settings.keys.copy')}
                          </Button>
                          <Button
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() =>
                              handleDownloadMnemonic(keyPair.mnemonic!)
                            }
                          >
                            <Download className="size-4 mr-1" />
                            {t('settings.keys.download')}
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}

                {/* Edit note */}
                <Popover
                  open={isNotePopoverOpen && editingIndex === index}
                  onOpenChange={(open) => !open && handleCancelNote()}
                >
                  <PopoverTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        aria-label={t('settings.editNote')}
                        onClick={() => handleEditNote(keyPair, index)}
                      />
                    }
                  >
                    <Pencil className="size-3.5" />
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

                {/* Delete */}
                <Popover
                  open={isDeletePopoverOpen && editingIndex === index}
                  onOpenChange={(open) => !open && handleCancelDelete()}
                >
                  <PopoverTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-red-500 hover:text-red-600"
                        aria-label={t('settings.keys.deleteTitle')}
                        onClick={() => handleDeleteClick(index)}
                      />
                    }
                  >
                    <Trash2 className="size-3.5" />
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
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
