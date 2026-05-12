import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle, Camera, UploadCloud } from "lucide-react"

export default function FaultReportPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Report Fault</h1>
        <p className="text-muted-foreground mt-1">
          Submit a new equipment fault or issue. High priority issues will trigger immediate alerts.
        </p>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle>Fault Details</CardTitle>
          <CardDescription>Provide as much information as possible to help technicians.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="asset">Equipment / Asset <span className="text-destructive">*</span></Label>
              <Select>
                <SelectTrigger id="asset">
                  <SelectValue placeholder="Select equipment..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ast-001">Defibrillator (AST-001)</SelectItem>
                  <SelectItem value="ast-002">MRI Scanner (AST-002)</SelectItem>
                  <SelectItem value="ast-003">Ventilator (AST-003)</SelectItem>
                  <SelectItem value="ast-004">ECG Machine (AST-004)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Issue Category <span className="text-destructive">*</span></Label>
              <Select>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="power">Power / Electrical</SelectItem>
                  <SelectItem value="mechanical">Mechanical</SelectItem>
                  <SelectItem value="software">Software / Display</SelectItem>
                  <SelectItem value="calibration">Calibration</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Priority Level</Label>
            <RadioGroup defaultValue="medium" className="flex flex-col sm:flex-row gap-4 pt-2">
              <div className="flex items-center space-x-2 border p-3 rounded-md flex-1 cursor-pointer hover:bg-slate-50">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="cursor-pointer">Low (Routine)</Label>
              </div>
              <div className="flex items-center space-x-2 border p-3 rounded-md border-amber-200 bg-amber-50/30 flex-1 cursor-pointer hover:bg-amber-50/50">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="cursor-pointer font-medium text-amber-700">Medium</Label>
              </div>
              <div className="flex items-center space-x-2 border p-3 rounded-md border-destructive/20 bg-destructive/5 flex-1 cursor-pointer hover:bg-destructive/10">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="cursor-pointer font-medium text-destructive flex items-center gap-1">
                  High <AlertCircle className="w-3 h-3" />
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
            <Textarea 
              id="description" 
              placeholder="Describe the issue in detail. What happened? Are there any error codes?" 
              className="min-h-[120px] resize-y"
            />
          </div>

          <div className="space-y-2">
            <Label>Photo / Evidence</Label>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-slate-200 transition-colors">
                <Camera className="w-6 h-6 text-slate-500" />
              </div>
              <p className="text-sm font-medium text-slate-700">Click to upload photo</p>
              <p className="text-xs text-slate-500 mt-1">or drag and drop</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3 p-6">
          <Button variant="outline">Cancel</Button>
          <Button className="flex items-center gap-2">
            <UploadCloud className="w-4 h-4" /> Submit Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
