import { useState } from 'react'
import QRCode from 'qrcode.react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Check } from 'lucide-react'
import { generatePixCode } from '@/lib/pix'
import { toast } from 'sonner'

interface PixData {
  key: string;
  name?: string;
  city?: string;
  amount?: number;
}

interface PixModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pixData: PixData
}

export function PixModal({ open, onOpenChange, pixData }: PixModalProps) {
  const [copied, setCopied] = useState(false)
  const pixCode = generatePixCode(pixData)

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode)
    setCopied(true)
    toast.success("Código PIX copiado!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/20 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white text-center">Pagar com PIX</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-white rounded-lg">
            <QRCode value={pixCode} size={200} />
          </div>
          <p className="text-sm text-white/80 text-center">
            Escaneie o QR Code com o app do seu banco
          </p>
          <div className="w-full space-y-2">
            <Label className="text-white text-sm">Ou use o PIX Copia e Cola:</Label>
            <div className="relative">
              <Input
                readOnly
                value={pixCode}
                className="bg-white/5 border-white/20 text-white pr-10 h-auto text-xs break-all"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={handleCopy}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/70" />}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}