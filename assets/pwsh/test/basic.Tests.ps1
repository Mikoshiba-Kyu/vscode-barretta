using namespace system.collections.generic
describe "pester is working" {
    beforeall {
    }
    it "basic" {
        $res = "123"
        $res | should -be "123"
    }
    it 'file existing check' {
        'c:\windows\notepad.exe' | should -exist
    }
    afterall {
    }
}