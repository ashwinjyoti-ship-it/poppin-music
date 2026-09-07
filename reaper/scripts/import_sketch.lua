-- Backup only. Send to Reaper now writes MIDI into Poppin_Sketch.rpp.
-- Use this script if you opened an older empty project and need to pull
-- the sidecar .mid files onto named tracks.

local function dirname(path)
  return path:match("^(.*)[/\\]") or "."
end

local project = reaper.GetProjectPath("")
local proj, projfn = reaper.EnumProjects(-1, "")
if projfn and projfn ~= "" then
  project = dirname(projfn)
end

local manifest_path = project .. "/pending-import.json"
local file = io.open(manifest_path, "r")
if not file then
  reaper.ShowMessageBox("No pending-import.json next to this project.\nGenerate from Poppin first.", "Poppin", 0)
  return
end

local raw = file:read("*a")
file:close()

local tracks = {
  Harmony = raw:match('"Harmony"%s*:%s*"([^"]+)"'),
  Bass = raw:match('"Bass"%s*:%s*"([^"]+)"'),
  Drums = raw:match('"Drums"%s*:%s*"([^"]+)"'),
}

local function find_track(name)
  local count = reaper.CountTracks(0)
  for i = 0, count - 1 do
    local track = reaper.GetTrack(0, i)
    local _, track_name = reaper.GetSetMediaTrackInfo_String(track, "P_NAME", "", false)
    if track_name == name then
      return track
    end
  end
  return nil
end

local function clear_items(track)
  local n = reaper.CountTrackMediaItems(track)
  for i = n - 1, 0, -1 do
    local item = reaper.GetTrackMediaItem(track, i)
    reaper.DeleteTrackMediaItem(track, item)
  end
end

reaper.Undo_BeginBlock()
reaper.PreventUIRefresh(1)

for name, midi_path in pairs(tracks) do
  if midi_path then
    midi_path = midi_path:gsub("\\/", "/")
    local track = find_track(name)
    if track then
      clear_items(track)
      reaper.SetOnlyTrackSelected(track)
      reaper.InsertMedia(midi_path, 0)
    end
  end
end

reaper.PreventUIRefresh(-1)
reaper.UpdateArrange()
reaper.Undo_EndBlock("Poppin import sketch", -1)
reaper.ShowMessageBox("Imported Harmony, Bass and Drums MIDI.", "Poppin", 0)
