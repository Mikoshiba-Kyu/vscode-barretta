using namespace system.collections.generic
describe "main" {
    beforeall {
        $here = "$(split-path -parent (split-path -parent $pscommandpath))"
        $sut = (split-path -leaf $pscommandpath) -replace ".tests.", "."
        $base = split-path $sut -leafbase
    }
    it 'exists shell template' {
        "$here/$sut" | should -exist
    }
    it "error" {
        Write-Host "$here/$base"
        { pwsh -nop -c "$here/$base" } | should -not -throw
    }
    afterall {
    }
}