import { DownloadSimple, File } from "@phosphor-icons/react"
import { useQuery } from "convex/react"
import { api } from "../convex/_generated/api"
import type { UploadedFile } from "./questions"

const MONO = "font-mono text-xs uppercase tracking-widest"

function triggerDownload(url: string, name: string) {
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = name
  anchor.target = "_blank"
  anchor.rel = "noreferrer"
  anchor.click()
}

export function FilePreview({
  file,
  downloadable = false,
}: {
  file: UploadedFile
  downloadable?: boolean
}) {
  const url = useQuery(api.files.getUrl, { storageId: file.storageId })

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex aspect-square items-center justify-center overflow-hidden border border-rule bg-rule/20">
        {!url ? (
          <div className="h-full w-full animate-pulse bg-rule/40" />
        ) : file.type.startsWith("image/") ? (
          <img src={url} alt={file.label ?? file.name} className="h-full w-full object-cover" />
        ) : file.type.startsWith("video/") ? (
          <video src={url} className="h-full w-full object-cover" controls preload="metadata" />
        ) : file.type === "application/pdf" ? (
          <object data={url} type="application/pdf" className="h-full w-full">
            <File size={28} className="text-muted" />
          </object>
        ) : (
          <File size={28} className="text-muted" />
        )}
      </div>
      <div className="min-w-0">
        {file.label ? (
          <div className="truncate text-sm font-light text-fg">{file.label}</div>
        ) : null}
        <div className="truncate text-xs font-light text-muted" title={file.name}>
          {file.name}
        </div>
      </div>
      {downloadable && url ? (
        <button
          type="button"
          onClick={() => triggerDownload(url, file.name)}
          className={`${MONO} flex items-center gap-2 self-start border border-rule px-3 py-2 text-muted transition-colors hover:border-fg hover:text-fg`}
        >
          <DownloadSimple size={14} />
          Download
        </button>
      ) : null}
    </div>
  )
}

export function FileGallery({
  files,
  downloadable = false,
}: {
  files: UploadedFile[]
  downloadable?: boolean
}) {
  const urls = useQuery(
    api.files.getUrls,
    downloadable ? { storageIds: files.map((file) => file.storageId) } : "skip",
  )

  const downloadAll = () => {
    if (!urls) return
    files.forEach((file, index) => {
      const url = urls[index]
      if (url) triggerDownload(url, file.name)
    })
  }

  if (files.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      {downloadable ? (
        <button
          type="button"
          onClick={downloadAll}
          disabled={!urls}
          className={`${MONO} flex items-center gap-2 self-start border border-rule px-3 py-2 text-muted transition-colors hover:border-fg hover:text-fg disabled:opacity-30`}
        >
          <DownloadSimple size={14} />
          Download all
        </button>
      ) : null}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {files.map((file) => (
          <FilePreview key={file.key} file={file} downloadable={downloadable} />
        ))}
      </div>
    </div>
  )
}
